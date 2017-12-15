const GithubStrategy = require('passport-github').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user.model');

module.exports.setup = (passport) => {
  passport.serializeUser(function(user, done) {
      done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
      User.findById(id, done);
  });

  passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK
  },
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ githubId: profile.id }, { username: profile._json.login }, (err, user) => {
        return cb(err, user);
      });
    }
  ));

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK
  },
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ facebookId: profile.id }, { username: profile._json.name }, (err, user) => {
        return cb(err, user);
      });
    }
  ));
};

module.exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
      next();
  } else {
      res.status(403).json({ message: 'Forbidden' });
  }
};
