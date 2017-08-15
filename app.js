const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// Connect  to Database
mongoose.connect(config.database);

// Show connection with DB
mongoose.connection.on('connected', () => {
  console.log('Connected to Database');
});
// Handle DB error
mongoose.connection.on('error', (err) => {
  console.log(err);
});

// Init express app
const app = express();

// User route
const users = require('./routes/users');


// Cors Middleware
app.use(cors());

// Body-parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
  res.send('Invalid endpoint');
});

app.use('/users', users);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});


//listen on port
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log('Server started on port '+ port);
});
