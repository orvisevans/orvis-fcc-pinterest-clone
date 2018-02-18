// Module Dependencies
const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('errorhandler');
const bodyParser = require('body-parser');
const session = require('express-session');
const logger = require('morgan');
const chalk = require('chalk');
const path = require('path');
const flash = require('express-flash');
const mongoose = require('mongoose');
const passport = require('passport');
const multer = require('multer');

const upload = multer({ dest: path.join(__dirname, 'uploads')});

//Environment variables
dotenv.load({path: '.env'});

//Controllers (route handlers)
const homeController = require('./controllers/home');
const pinController = require('./controllers/pin');
const userController = require('./controllers/user');
const apiController = require('./controllers/api');

//API keys and passport config
const passportConfig = require('./config/passport');

//Create Express server
const app = express();

//Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOLAB_URI);
mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('%s mongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
});

//Express configuration
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});



//Primary app routes
app.get('/', homeController.index);
app.get('/new-pin', passportConfig.isAuthenticated, pinController.getNewPin);
app.get('/pin/:id', pinController.getOnePin);
app.get('/pinsBy/user/:id', pinController.getPinsBy);
// app.get('/signup', userController.getSignup);
// app.get('/account', userController.passportConfig.isAuthenticated, userController.getAccount);
// app.get('/user/:user', userController.browseUser);
// app.post('/account/delete', userController.postDeleteAccount);
// app.get('/upload', passportConfig.isAuthenticated, userController.getUpload);
// app.post('/upload', passportConfig.isAuthenticated, userController.postUpload);

//API routes
app.get('/api', apiController.getApi);
app.post('/api/new-pin', passportConfig.isAuthenticated, pinController.postNewPin);
app.delete('/api/delete/pin/:id', passportConfig.isAuthenticated, pinController.deletePin);
// app.post('/api/upload', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.newPin);
// app.delete('/api/delete-pin', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.deletePin);

//OAuth authentication routes
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/auth/twitter' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

//OAuth authorization routes


//Error Handler
app.use(errorHandler());

//Start Express server
app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
});

module.exports = app;

  