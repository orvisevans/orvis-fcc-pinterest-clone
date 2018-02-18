const passport = require('passport');
const User = require('../models/User');

/**
 * Get /logout
 * Log out
 */
exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};