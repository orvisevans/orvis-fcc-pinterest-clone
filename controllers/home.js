const pinController = require('./pin');

// Get /
// Home Page

exports.index = (req, res) => {
    pinController.getFreshPins(req, res);
}