const express = require('express');
const app = express();
const cors = require('cors')
const routers = require('./routers/routers');

app.use(cors());

app.use(express.json());
app.use('/', routers);

app.get('/', (req, res) => {
  res.send('Welcome to server routers');
});

module.exports = app;