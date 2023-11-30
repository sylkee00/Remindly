const express = require('express');
const router = express.Router();
const authController = require('../controller/auth_controller');
const passport = require('passport');

// Login route
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard', // Adjust as necessary
    failureRedirect: '/login',
    failureFlash: true
}));

// Register route
router.post('/register', authController.register);

module.exports = router;
