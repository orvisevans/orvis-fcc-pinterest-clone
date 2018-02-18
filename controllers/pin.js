const Pin = require('../models/Pin');

/**
 * Get /new-pin
 * page to post a new pin
 */

exports.getNewPin = (req, res) => {
    res.render('new-pin', {
        title: "New Pin"
    });
};

/**
 * Post /api/new-pin
 * receives new-pin submission
 */

 exports.postNewPin = (req, res) => {
    //  let newPin = new Pin{
    //      source: req.soure
    //  }
    let newPin = new Pin({
        source: req.body.source,
        title: req.body.title,
        owner: ""
    });
    newPin.save((err, doc) => {
        if(err) { return console.error(err); }
        res.redirect('/pin/' + newPin.id);
    });
 }

 /**
  * Get one pin with its id and render one onePin view
  */
 exports.getOnePin = (req, res) => {
     Pin.findById(req.params.id, (err, pin) => {
         if (err) { res.locals.pins=[]; return console.error(err); }
         res.locals.pin = pin
         res.render('one-pin', {
             title: pin.title
         });
     });
 };

 /**
  * Get fresh pins and render home view with them
  */
 exports.getFreshPins = (req, res) => {
     Pin.find({}, {limit: 20}, (err, pins) => {
         if (err) { res.locals.pins=[]; return console.error(err); }
         res.locals.pins = pins
         res.render('pinboard', {
             title: 'Home'
         });
     });
 };