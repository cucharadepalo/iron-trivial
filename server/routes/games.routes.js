const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Game = require('../models/game.model');
const GameUser = require('../models/game-user.model');
const User = require('../models/user.model');
const Question = require('../models/question.model');
const CATEGORIES = require('../models/categories');
const _ = require ('lodash');

// Single game object
router.get('/game', (req, res, next) => {
  const id = req.query.id;
  if (id) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      Game.findById(id).populate('questions participants')
        .then(game => {
          game ? res.json(game) : res.status(204).json({ message: 'No Open games' });
        })
        .catch(err => next(err));
    } else {
      res.status(400).json({ message: 'Invalid game id' });
    }
  } else {
    res.status(400).json({message: 'You have to provide a game id by a query param'});
  }
});
// Single game creation
router.post('/game', (req, res, next) => {
  const userId = req.user.id;
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
      .then(game => Game.findById(game._id).populate('questions participants')
        .then(g => {
          res.json(g);
          GameUser.create({ _gameId: g.id, _userId: g.creator });
        })
      );
    })
    .catch(err => next(err));
});
// Games request
router.get('/games', (req, res, next) => {
  const status = req.query.status;
  let query = {};
  if (status !== undefined && status !== null) {
    query = { status: status };
  }
  Game.find(query).populate('questions participants')
    .then(games => {
      games.length > 0 ? res.json(games) : res.status(204).json({ message: 'There aren\'t games'});
    })
    .catch(err => next(err));
});
// Game add participants
router.put('/game/:id', (req, res, next) => {
  const id = req.params.id;
  const participant = req.user.id;
  if (id && participant) {
    Game.findById(id).populate('participants')
      .then(game => {
        let p = game.participants.map(m => m.id.toString());
        if (_.includes(p, participant)) {
          console.log('user is already a participant in this game');
          res.json({message: 'user is already a participant in this game', game:game});
        } else {
          game.participants.push(participant);
          game.save()
            .then(game => {
              console.log('participant added to the game');
              res.json({message: 'participant added to the game', game:game});

              // modelo intermedio
              GameUser.find({ _gameId: game._id, _userId: participant })
              .then(doc => {
                //console.log(`Cuántos hay: ${doc.length}`);
                if (!doc.length) {
                  GameUser.create({ _gameId: game._id, _userId: participant });
                }
              });
          });
        }
      })
      .catch(err => next(err));
  } else {
    res.status(400).json({ message: 'You have to provide a game id by a url param' });
  }
});
// Start a game
router.put('/game/start/:id', (req, res, next) => {
  const id = req.params.id;
  const setP = { $set: {status: 'playing'}};
  if (id) {
    Game.findByIdAndUpdate(id, setP, { new: true }).populate('questions participants')
      .then(game => {
        res.json(game);
        GameUser.find({_gameId: game._id})
          .then(docs => {
            let promises = docs.map(e => {
              e.status = 'playing';
              e.save();
            });
            return Promise.all(promises);
          });
      })
      .catch(err => next(err));
  } else {
    res.status(400).json({message: 'You have to provide a game id by a url param'});
  }
});
// Finish a game
router.put('/game/finish/:id', (req, res, next) => {
  const id = req.params.id;
  const setP = { $set: {status: 'finished'}};
  if (id) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      Game.findByIdAndUpdate(id, setP, { new: true })
        .then(game => {
          if (game) {
            res.json(game);
            GameUser.find({_gameId: game._id})
              .then(docs => {
                let promises = docs.map(e => {
                  e.status = 'finished';
                  e.save();
                });
                return Promise.all(promises);
              });
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
// User is in a game inPlay
router.get('/gameuser', (req, res, next) => {
  const userId = req.query.id;
  if (userId) {
    GameUser.findOne({ _userId: userId, status: { $in: ['open', 'playing'] }}, {_gameId: 1})
      .then(doc => {
        if (doc) {
          res.status(200).json(doc);
        } else {
          res.status(204).json({message: 'User is not playing any game'});
        }
      });
  } else {
    res.status(400).json({message: 'You have to provide a user id to search for'});
  }

});
// Update questions on user docs
router.put('/gameuser/questions', (req, res, next) => {
  const userId = req.body._userId;
  const gameId = req.body._gameId;
  const {_questionId, guessed, category} = req.body;
  console.log(userId);
  let score;
  guessed ? score = 1 : score = 0;
  const answer = { _questionId, category, guessed, score};
  let pushA = {};
  answer !== {} ? pushA = {$push: { questions: answer }} : pushA;
  console.log('Llego hasta aqui:');
  console.log(`El user id es: ${userId}`);
  GameUser.findOneAndUpdate({ _userId: userId, _gameId: gameId}, pushA, { new: true })
    .then(doc => {
      console.log(doc._userId);
      User.findByIdAndUpdate(userId, pushA, { new: true })
        .then(user => {
          if (!user) {
              res.status(404).json({ message: 'User not found' });
          } else {
              res.status(200).json({ message: 'Update done!' });
          }
        });
    })
    .catch(err => next(err));
});


module.exports = router;
