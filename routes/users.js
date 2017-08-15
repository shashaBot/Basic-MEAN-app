const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('../config/database');
const User = require('../models/user');

// Register route
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });
  User.addUser(newUser, (err, user) => {
    if(err) {
      console.log(err);
      res.json({success: false, msg: 'Failed to register user.'});
    } else {
      res.json({success: true, msg: 'User Registered.'});
    }
  });
});

// Authenticate route
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) {
      throw err;
    } else if(!user){
      return res.json({success: false, msg: 'User not found!'});
    } else {
      User.comparePassword(password, user.password, (err, isMatch) => {
        if(err) {
          throw err;
        }
        else if(isMatch) {
          const token = jwt.sign(user, config.secret, {
            expiresIn: 604800 // 1 week
          });
          res.json({
            success: true,
            token: 'JWT '+token,
            user: {
              id: user.id,
              name: user.name,
              username: user.username,
              email: user.email
            }
          });
        } else {
          res.json({success: false, msg: 'Wrong Password'});
        }
      });
    }
  });
});

// Profile route
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({user: req.user});
});

module.exports = router;
