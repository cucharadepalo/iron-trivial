const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Game = require('../models/game.model');
const GameUser = require('../models/game-user.model');
const Question = require('../models/question.model');
const CATEGORIES = require('../models/categories');

router.get('/game', (req, res, next) => {
  const id = req.query.id;
  if (id) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      Game.findById(id).populate('questions')
        .then(game => {
          game ? res.json(game) : res.status(404).json({ message: 'Game not found' });
        })
        .catch(err => next(err));
    } else {
      res.status(400).json({ message: 'Invalid game id' });
    }
  } else {
    res.status(400).json({message: 'You have to provide a game id by a query param'});
  }
});

router.post('/game', (req, res, next) => {
  const userId = req.body.userId;
  let promises = CATEGORIES.map(cat => {
    return Question.findRandom({ approved: true, category: cat }, '_id', { limit: 1 });
  });
  Promise.all(promises)
    .then(q => {
      const gameInfo = {
        creator: userId,
        name: req.body.gameName,
        participants: [ userId ],
        questions: [].concat.apply([], q)
      };
      const game = new Game(gameInfo);
      game.save()
      .then(game => Game.findById(game._id).populate('questions')
        .then(g => {
          res.json(g);
          GameUser.create({ _gameId: g.id, _userId: g.creator });
        })
      );
    })
    .catch(err => next(err));
});

router.put('/game/:id', (req, res, next) => {
  const id = req.params.id;
  const participant = req.body.userId;
  let pushP = {};
  participant ? pushP = {$push: { participants: participant }} : pushP;
  if (id) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      Game.findByIdAndUpdate(id, pushP, { new: true }).populate('questions')
        .then(game => {
          if (game) {
            res.json(game);
            GameUser.create({ _gameId: game._id, _userId: participant });
          } else {
            res.status(404).json({ message: 'Game not found' });
          }
        })
        .catch(err => next(err));
    } else {
      res.status(400).json({ message: 'Invalid game id' });
    }
  } else {
    res.status(400).json({message: 'You have to provide a game id by a url param'});
  }
});


module.exports = router;
