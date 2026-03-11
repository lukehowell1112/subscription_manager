const port = process.argv.length > 2 ? process.argv[2] : 4000;
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

let subscriptions = [];

app.get('/api/subscriptions', (req, res) => {
    res.send(subscriptions);
});

app.post('/api/subscriptions', (req, res) => {
    const subscription = {
        id: uuidv4(),
        ...req.body
    };

    subscriptions.push(subscription);
    res.send(subscription);
});

app.delete('/api/subscriptions/:id', (req, res) => {
    const id = req.params.id;
    subscriptions = subscriptions.filter(sub => sub.id !== id);
    res.send.apply({ messafe: "Deleted" });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});