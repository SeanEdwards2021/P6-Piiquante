// IMPORTED PACKAGES
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// MIDDLEWARE
const dotenv = require("dotenv").config();

// CONNECTION TO MONGO DB
mongoose.connect(process.env.Database_Connection, 
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connection to the database was successful!'))
  .catch(() => console.log('Connection to the database was not successful!'));

const app = express();

// CORS HEADERS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;

