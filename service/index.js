const port = process.argv.length > 2 ? process.argv[2] : 4000;
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

let subscriptions = [];

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

app.delete('/api/subscriptions/:id', (req, res) => {
  const id = req.params.id;
  subscriptions = subscriptions.filter((sub) => sub.id !== id);
  res.json({ message: 'Deleted' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});