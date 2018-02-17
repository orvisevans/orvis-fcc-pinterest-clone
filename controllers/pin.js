const Pin = require('../models/Pin');

/**
 * Get /login
 * Login page
 */
exports.getFreshPins = (req, res) => {
    Pin.find({}, 'source title', {limit: 20}, (err, pins) => {
        if (err) { res.locals.pins=[]; return console.error(err); }
        res.locals.pins = pins
        res.render('home', {
            title: 'Home'
        });
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