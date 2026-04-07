const port = process.argv.length > 2 ? process.argv[2] : 4000;
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const DB = require('./database');

const http = require('http');
const { WebSocketServer, WebSocket } = require('ws');

const app = express();

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const publicPath = path.join(__dirname, 'public');

app.use(cors({
	origin: [
		'http://localhost:5173',
		'https://startup.subscriptionmanager.click',
	],
	credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static(publicPath));

function setAuthCookie(res, authToken) {
	res.cookie('token', authToken, {
		httpOnly: true,
		sameSite: 'lax',
		secure: false,
	});
}

async function getAuthUser(req) {
	const token = req.cookies?.token;
	if (!token) {
		return null;
	}
	return DB.getUserByToken(token);
}

function broadcast(data) {
	const message = JSON.stringify(data);

	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(message);
		}
	});
}

async function broadcastDashboardUpdate(ownerUserId, data) {
	const shares = await DB.getDashboardSharesByOwnerId(ownerUserId);

	const allowedUserIds = new Set([ownerUserId]);
	for (const share of shares) {
		allowedUserIds.add(share.viewerUserId);
	}

	const message = JSON.stringify(data);

	wss.clients.forEach((client) => {
		if (
			client.readyState === WebSocket.OPEN &&
			client.userId &&
			allowedUserIds.has(client.userId)
		) {
			client.send(message);
		}
	});
}

wss.on("connection", async (ws, req) => {
	console.log("WebSocket client connected");

	const cookieHeader = req.headers.cookie || "";
	const tokenMatch = cookieHeader.match(/token=([^;]+)/);
	const token = tokenMatch ? tokenMatch[1] : null;

	if (token) {
		const user = await DB.getUserByToken(token);
		if (user) {
			ws.userId = user.id;
			ws.userEmail = user.email;
		}
	}

	ws.send(JSON.stringify({
		type: "welcome",
		message: "Connected to Subscription Manager notifications"
	}));

	ws.on("message", (message) => {
		try {
			const data = JSON.parse(message.toString());
			console.log("Received from client:", data);

			if (data.type === "enable_notifications") {
				ws.send(JSON.stringify({
					type: "notification",
					message: "Notifications enabled!"
				}));
			}

			if (data.type === "share_dashboard") {
				broadcast({
					type: "notification",
					message: "Dashboard sharing started!"
				});
			}
		} catch (err) {
			console.error("Invalid WebSocket message:", err);
		}
	});

	ws.on("close", () => {
		console.log("WebSocket client disconnected");
	});
});

app.post('/api/share-dashboard', async (req, res) => {
	try {
		const user = await getAuthUser(req);

		if (!user) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		const { email } = req.body;

		if (!email) {
			return res.status(400).json({ message: 'Username is required' });
		}

		const viewer = await DB.getUser(email);

		if (!viewer) {
			return res.status(404).json({ message: 'User not found' });
		}

		if (viewer.id === user.id) {
			return res.status(400).json({ message: 'You cannot share your dashboard with yourself' });
		}

		const existingShare = await DB.getDashboardShare(user.id, viewer.id);

		if (existingShare) {
			return res.status(409).json({ message: 'Dashboard already shared with this user' });
		}

		const share = {
			id: uuidv4(),
			ownerUserId: user.id,
			ownerEmail: user.email,
			viewerUserId: viewer.id,
			viewerEmail: viewer.email,
			canEdit: false,
		};

		await DB.addDashboardShare(share);

		res.status(201).json({
			message: `Dashboard shared with ${viewer.email}`,
			share,
		});
	} catch (err) {
		console.error("Error in /api/share-dashboard:", err);
		res.status(500).json({ message: 'Internal server error' });
	}
});

app.get('/api/subscriptions', async (req, res) => {
	const user = await getAuthUser(req);

	if (!user) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	const userSubscriptions = await DB.getSubscriptionsByUserId(user.id);
	res.json(userSubscriptions);
});

app.post('/api/subscriptions', async (req, res) => {
	const user = await getAuthUser(req);

	if (!user) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	const subscription = {
		id: uuidv4(),
		userId: user.id,
		...req.body,
	};

	await DB.addSubscription(subscription);

	await broadcastDashboardUpdate(user.id, {
		type: "subscription_added",
		message: `Subscription "${subscription.name}" added`,
	});

	res.status(201).json(subscription);
});

app.put('/api/subscriptions/:id', async (req, res) => {
	const user = await getAuthUser(req);

	if (!user) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	const id = req.params.id;

	const updatedSubscription = await DB.updateSubscription(id, user.id, {
		...req.body,
	});

	if (!updatedSubscription) {
		return res.status(404).json({ message: 'Subscription not found' });
	}

	await broadcastDashboardUpdate(user.id, {
		type: "subscription_updated",
		message: `Subscription "${updatedSubscription.name}" updated`,
	});

	res.json(updatedSubscription);
});

app.delete('/api/subscriptions/:id', async (req, res) => {
	const user = await getAuthUser(req);

	if (!user) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	const id = req.params.id;
	const deleted = await DB.deleteSubscription(id, user.id);

	if (!deleted) {
		return res.status(404).json({ message: 'Subscription not found' });
	}

	await broadcastDashboardUpdate(user.id, {
		type: "subscription_deleted",
		message: "Subscription deleted",
	});

	res.json({ message: 'Deleted' });
});

app.post('/api/auth/create', async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: 'Email and password are required' });
	}

	const existingUser = await DB.getUser(email);
	if (existingUser) {
		return res.status(409).json({ message: 'User already exists' });
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const user = {
		id: uuidv4(),
		email,
		password: hashedPassword,
		token: uuidv4(),
	};

	await DB.addUser(user);
	setAuthCookie(res, user.token);

	res.json({ email: user.email });
});

app.post('/api/auth/login', async (req, res) => {
	const { email, password } = req.body;

	const user = await DB.getUser(email);

	if (!user || !user.password) {
		return res.status(401).json({ message: 'Invalid email or password' });
	}

	const match = await bcrypt.compare(password, user.password);

	if (!match) {
		return res.status(401).json({ message: 'Invalid email or password' });
	}

	user.token = uuidv4();
	await DB.updateUser(user);
	setAuthCookie(res, user.token);

	res.json({ email: user.email });
});

app.delete('/api/auth/logout', async (req, res) => {
	const token = req.cookies?.token;
	const user = token ? await DB.getUserByToken(token) : null;

	if (user) {
		await DB.clearUserToken(user.id);
	}

	res.clearCookie('token');
	res.json({ message: 'Logged out' });
});

app.get('/api/user', async (req, res) => {
	const token = req.cookies?.token;
	const user = token ? await DB.getUserByToken(token) : null;

	if (!user) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	res.json({ email: user.email });
});

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});