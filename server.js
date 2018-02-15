// Module Dependencies
const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('errorhandler');
const bodyParser = require('body-parser')
const logger = require('morgan');
const chalk = require('chalk');
const lusca = require('lusca');
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
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
      req.path === '/account') {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));



//Primary app routes
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
// app.post('/login', userController.postLogin);
// app.get('/signup', userController.getSignup);
// app.get('/account', userController.passportConfig.isAuthenticated, userController.getAccount);
// app.get('/user/:user', userController.browseUser);
// app.post('/account/delete', userController.postDeleteAccount);
// app.get('/upload', passportConfig.isAuthenticated, userController.getUpload);
// app.post('/upload', passportConfig.isAuthenticated, userController.postUpload);

//API routes
app.get('/api', apiController.getApi);
// app.post('/api/upload', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.newPin);
// app.delete('/api/delete-pin', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.deletePin);

//OAuth authentication routes
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
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

  