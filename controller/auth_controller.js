const passport = require('passport');
const User = require('../models/userModel');
let database = require("../database");


let authController = {
  login: (req, res) => {
    res.render("auth/login");
  },

  register: (req, res) => {
    res.render("auth/register");
  },

  loginSubmit: (req, res) => {
    // implement later
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  },

  registerSubmit: (req, res) => {
    // implement later
  },
};

module.exports = authController;
