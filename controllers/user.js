const passport = require('passport');
const User = require('../models/User');

/**
 * Get /login
 * Login page
 */
exports.getLogin = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('account/login', {
        title: 'Login'
    });
};

/**
 * Get /logout
 * Log out
 */
exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};