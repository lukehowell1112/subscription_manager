const port = process.argv.length > 2 ? process.argv[2] : 4000;
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
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
  });
}

app.get('/api/subscriptions', (req, res) => {
  console.log('GET /api/subscriptions hit');
  res.json(subscriptions);
});

app.post('/api/subscriptions', (req, res) => {
  console.log('POST /api/subscriptions hit');
  console.log('Body:', req.body);
  console.log('uuidv4 inside POST:', typeof uuidv4);

  const subscription = {
    id: uuidv4(),
    ...req.body,
  };

  subscriptions.push(subscription);
  res.status(201).json(subscription);
});

app.put('/api/subscriptions/:id', (req, res) => {
  const id = req.params.id;

  const index = subscriptions.findIndex((sub) => sub.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Subscription not found' });
  }

  subscriptions[index] = {
    ...subscriptions[index],
    ...req.body,
    id: subscriptions[index].id,
  };

  res.json(subscriptions[index]);
});

app.delete('/api/subscriptions/:id', (req, res) => {
  const id = req.params.id;
  subscriptions = subscriptions.filter((sub) => sub.id !== id);
  res.json({ message: 'Deleted' });
});



app.post('/api/auth/create', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const existingUser = findUser('email', email);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const user = {
    id: uuidv4(),
    email,
    password,
    token: uuidv4(),
  };

  users.push(user);
  setAuthCookie(res, user.token);

  res.json({ email: user.email });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
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