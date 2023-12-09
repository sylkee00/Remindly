const passport = require('passport');
const User = require('../models/userModel');


let authController = {
  login: (req, res) => {
    res.render("auth/login");
  },

  register: (req, res) => {
    res.render("auth/register");
  },

  loginSubmit: (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
      if (err) { 
        return next(err); 
      }
      if (!user) {
        // If user is not found, redirect back to login page
        return res.redirect('/login');
      }
      req.logIn(user, function(err) {
        if (err) { 
          return next(err); 
        }
        // Set any additional session properties you need after successful login
        req.session.userId = user.id; 
        console.log('Logged in user:', user);
        console.log('Session after login:', req.session);
        // Redirect to the desired page after successful login
        return res.redirect('/dashboard');
        
      });
    })(req, res, next);
  },


  registerSubmit: (req, res) => {
    // implement later
  },
};

module.exports = authController;
