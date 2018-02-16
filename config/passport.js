const passport = require('passport');
const request = require('request');
const TwitterStrategy = require('passport-twitter').Strategy;
const OAuthStrategy = require('passport-oauth').OAuthStrategy;
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *       - Else create a new account.
 */

 // Sign in with Twitter.

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackURL: '/auth/twitter/callback',
    passReqToCallback: true
  }, (req, accessToken, tokenSecret, profile, done) => {
    if (req.user) {
      User.findOne({ twitter: profile.id }, (err, existingUser) => {
        if (err) { return done(err); }
        if (existingUser) {
          req.flash('errors', { msg: 'There is already a Twitter account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
          done(err);
        } else {
          User.findById(req.user.id, (err, user) => {
            if (err) { return done(err); }
            user.twitter = profile.id;
            user.tokens.push({ kind: 'twitter', accessToken, tokenSecret });
            user.profile.name = user.profile.name || profile.displayName;
            user.profile.location = user.profile.location || profile._json.location;
            user.profile.picture = user.profile.picture || profile._json.profile_image_url_https;
            user.save((err) => {
              if (err) { return done(err); }
              req.flash('info', { msg: 'Twitter account has been linked.' });
              done(err, user);
            });
          });
        }
      });
    } else {
      User.findOne({ twitter: profile.id }, (err, existingUser) => {
        if (err) { return done(err); }
        if (existingUser) {
          return done(null, existingUser);
        }
        const user = new User();
        user.twitter = profile.id;
        user.tokens.push({ kind: 'twitter', accessToken, tokenSecret });
        user.profile.name = profile.displayName;
        user.profile.location = profile._json.location;
        user.profile.picture = profile._json.profile_image_url_https;
        user.save((err) => {
          done(err, user);
        });
      });
    }
  }));

  /**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  };
  
  /**
   * Authorization Required middleware.
   */
  exports.isAuthorized = (req, res, next) => {
    const provider = req.path.split('/').slice(-1)[0];
    const token = req.user.tokens.find(token => token.kind === provider);
    if (token) {
      next();
    } else {
      res.redirect(`/auth/${provider}`);
    }
  };
  