const socketio = require('socket.io');
const Game = require('../models/game.model.js');
const User = require('../models/user.model.js');

let questionTimeOut = 2;
let currentQuestion = 0;
let startTimeOut = 1;
let lastTimeout = 3;
let gameRoom = 'iron-trivia';

function sendNextQuestion(io, game) {
  // check if game is ended
  if (currentQuestion < game.questions.length) {
    // Next question
    let q = game.questions[currentQuestion];
    io.in(gameRoom)
      .emit('question', {
        question: q,
        timeRemaining: questionTimeOut,
        questionIndex: currentQuestion
      });
    currentQuestion++;
    setTimeout(() => {
      sendNextQuestion(io, game);
    }, questionTimeOut * 1000);
  } else {
    // end game
    io.in(gameRoom)
      .emit('calculate-game', {
        question: null,
        timeRemaining: 0,
        questionIndex: null,
      });
  }
}

module.exports = (app) => {
  const io = socketio(app);
  io.on('connection', function(socket) {

    socket.on('disconnect', function() {
      console.log('user disconnected');
    });

    socket.join(gameRoom);

    socket.on('init-game', function(data) {
      //console.log(`El juego va a empezar`);
      Game.findById(data.gameId)
        .populate('questions')
        .then(game => {
          io.in(gameRoom).emit('start-game', {
              name: game.name,
              timeRemaining: startTimeOut
            });
          setTimeout(() => {
            sendNextQuestion(io, game);
          }, startTimeOut * 1000);
        });
      });

      socket.on('join-game', function (data) {
        console.log(`Un usuario se ha unido a la partida`);
        User.findById(data.userId)
          .then( user => {
            io.in(gameRoom).emit('recibe-user', {
              username: user.username
            });
          });
      });

      // socket.on('answers-posted', function (data) {
      //   Game.findById(data.gameID)
      //     .then(game => {
      //       io.in(gameRoom).emit('game-end', {
      //         ranking: game.ranking
      //       });
      //     });
      // });

  });
};
