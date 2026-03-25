const port = process.argv.length > 2 ? process.argv[2] : 4000;
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const DB = require('./database');

const app = express();

app.use(cors({
	origin: [
		'http://localhost:5173',
		'https://startup.subscriptionmanager.click',
	],
	credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

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
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});