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
    let newPin = new Pin({
        source: req.body.source,
        title: req.body.title,
        owner: req.user.id
    });
    newPin.save((err, doc) => {
        if(err) { return console.error(err); }
        res.redirect('/pin/' + newPin.id);
    });
 }

 /**
  * Delete /api/delete/pin/:id
  * deletes an existing pin
  */

  exports.deletePin = (req, res) => {
      Pin.findByIdAndRemove(req.params.id, (err, offer) => {
          if(err) { return console.error(err); }
          res.send('deleted!');
      });
  }

 /**
  * Get one pin with its id and render one onePin view
  */
 exports.getOnePin = (req, res) => {
     Pin.findById(req.params.id, (err, pin) => {
         if (err) { res.locals.pins=[]; return console.error(err); }
        Pin.populate(pin, {path: 'owner'}, (err, pin) => {
            if (err) { return console.error(err); }
            if (pin) {
                res.locals.pin = pin;
                res.render('one-pin', {
                    title: pin.title
                });
            } else {
                res.redirect('/');
            }
        })
     });
 };

 /**
  * Get pins by one user
  */

  exports.getPinsBy = (req, res) => {
      Pin.find({owner: req.params.id}, null, {limit: 20}, (err, pins) => {
          if (err) { res.locals.pins=[]; return console.error(err); }
          res.locals.header = "Pins by " + req.params.id;
          renderPins(pins, res);
      })
  }

  /**
   * Get pins of logged in user
   */

   exports.getMyPins = (req, res) => {
       res.redirect('/pinsBy/user/' + req.user.id);
   }

 /**
  * Get fresh pins and render home view with them
  */
 exports.getFreshPins = (req, res) => {
     Pin.find({}, null, {limit: 50}, (err, pins) => {
         if (err) { res.locals.pins=[]; return console.error(err); }
         renderPins(pins, res);
     });
 };


 /**
  *  Render a pin set
  */

  renderPins = (pins, res) => {
    res.locals.pins = pins;
    Pin.populate(pins, {path: 'owner'}, (err, pins) => {
        if (err) {return console.error(err); }
        res.render('pinboard', {
            title: 'Pinboard'
        });
    });
  }