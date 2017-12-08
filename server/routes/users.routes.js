const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

router.get('/', (req, res, next) => {
  User.find()
    .then(users => res.status(200).json(users))
    .catch(err => next(err));
});

router.put('/:id', (req, res, next) => {
  const userId = req.params.id;
  const {_questionId, category, guessed } = req.body;
  const question = { _questionId, category, guessed };
  let pushQ = {};
  question !== {} ? pushQ = {$push: { questions: question }} : pushQ;
  User.findByIdAndUpdate(userId, pushQ, { new: true })
    .then(user => {
      if (!user) {
          res.status(404).json({ message: 'User not found' });
      } else {
          res.json(user);
      }
    })
    .catch(err => next(err));
});

module.exports = router;
