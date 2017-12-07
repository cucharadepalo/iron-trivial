const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConfig = require('../config/passport.config');

router.get('/github', passport.authenticate('github'));
router.get('/github/callback',
  passport.authenticate('github'),
  (req, res, next) => {
    res.json(req.user);
  });
router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback',
  passport.authenticate('facebook'),
  (req, res, next) => {
    res.json(req.user);
  });

module.exports = router;
