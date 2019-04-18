const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Database = require('./db');
const db = new Database();

app.use(bodyParser.json());

app.get('/bots', async (req, res) => {
    const bots = db.getBots();
    res.send(bots);
});

app.post('/register', async (req, res) => {
    const data = { ...req.body };
    db.addBot(data);
    res.send({ message: 'Success' });
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});