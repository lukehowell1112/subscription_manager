const port = process.argv.length > 2 ? process.argv[2] : 4000;
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://startup.subscriptionmanager.click',
    ],
    credentials: true,
}));

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

let subscriptions = [];
let users = [];

function findUser(field, value) {
  return users.find((user) => user[field] === value);
}

function setAuthCookie(res, authToken) {
    res.cookie('token', authToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
  });
}

function getAuthUser(req) {
    const token = req.cookies?.token;
    return users.find((u) => u.token === token);
}

app.get('/api/subscriptions', (req, res) => {
    const user = getAuthUser(req);

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const userSubscriptions = subscriptions.filter(
        (sub) => sub.userId === user.id
    );

    res.json(userSubscriptions);
});

app.post('/api/subscriptions', (req, res) => {
    const user = getAuthUser(req);

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const subscription = {
        id: uuidv4(),
        userId: user.id,
        ...req.body,
    };

    subscriptions.push(subscription);
    res.status(201).json(subscription);
});

app.put('/api/subscriptions/:id', (req, res) => {
    const user = getAuthUser(req);

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const id = req.params.id;

    const index = subscriptions.findIndex(
        (sub) => sub.id === id && sub.userId === user.id
    );

    if (index === -1) {
        return res.status(404).json({ message: 'Subscription not found' });
    }

    subscriptions[index] = {
        ...subscriptions[index],
        ...req.body,
        id: subscriptions[index].id,
        userId: subscriptions[index].userId,
    };

    res.json(subscriptions[index]);
});

app.delete('/api/subscriptions/:id', (req, res) => {
    const user = getAuthUser(req);

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const id = req.params.id;

    const originalLength = subscriptions.length;

    subscriptions = subscriptions.filter(
        (sub) => !(sub.id === id && sub.userId === user.id)
    );

    if (subscriptions.length === originalLength) {
        return res.status(404).json({ message: 'Subscription not found' });
    }

    res.json({ message: 'Deleted' });
});



app.post('/api/auth/create', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = findUser('email', email);
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

    users.push(user);
    setAuthCookie(res, user.token);

    res.json({ email: user.email });
    });

    app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);

    if (!user || !user.password) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    user.token = uuidv4();
    setAuthCookie(res, user.token);

    res.json({ email: user.email });
    });

    app.delete('/api/auth/logout', (req, res) => {
    const token = req.cookies?.token;
    const user = users.find((u) => u.token === token);

    if (user) {
        user.token = null;
    }

    res.clearCookie('token');
    res.json({ message: 'Logged out' });
});

app.get('/api/user', (req, res) => {
    const token = req.cookies?.token;
    const user = users.find((u) => u.token === token);

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json({ email: user.email });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});