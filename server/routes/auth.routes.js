const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConfig = require('../config/passport.config');

router.get('/user', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(401).json({ message: 'Unauthorized' });
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Success' });
  });

router.get('/github', passport.authenticate('github'));
router.get('/github/callback',
  passport.authenticate('github'),
  (req, res, next) => {
    res.redirect(process.env.LOGIN_CALLBACK);
    //res.json(req.user);
  });

router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback',
  passport.authenticate('facebook'),
  (req, res, next) => {
    res.redirect(process.env.LOGIN_CALLBACK);
    //res.json(req.user);
  });

module.exports = router;
