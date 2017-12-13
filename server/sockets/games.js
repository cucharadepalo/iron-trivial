const socketio = require('socket.io');
const Game = require('../models/game.model.js');
const User = require('../models/user.model.js');

let questionTimeOut = 5 * 1000;
let currentQuestion = 0;

function sendNextQuestion(socket, game){
  //console.log(`Broadcasting question ${game.questions[currentQuestion].id}, next in ${questionTimeOut}`);
  // check if game is ended
  if(currentQuestion < game.questions.length){
    // Next question
    let q = game.questions[currentQuestion];
    socket.broadcast.emit('question', {
      question: q,
      timeRemaining: questionTimeOut
    });
    currentQuestion++;
    setTimeout(() =>{
      sendNextQuestion(socket, game);
    }, questionTimeOut);
  }else{
   // end game
   let gameStatistics = {};
   socket.broadcast.emit('game-end', gameStatistics);
  }
}

module.exports = (app) =>{
  const io = socketio(app);

  io.on('connection', function (socket) {
    console.log(`Connected to SOCKETIO ${socket.id}`);

    socket.on('init-game', function (data) {
      //console.log(data.gameId);
      Game.findById(data.gameId)
        .populate('questions')
        .then( game => {
          socket.broadcast.emit('start-game', {
            name: game.name
          });
          let startTimeOut = 5 * 1000;
          console.log(`Starting game in ${startTimeOut} milisec`);
          setTimeout(() =>{
            sendNextQuestion(socket, game);
          }, startTimeOut);
        });
    });

    socket.on('join-game', function (data) {
      User.findById(data.userId)
        .then( user => {
          socket.broadcast.emit('recibe-user', {
            username: user.username
          });
        });
    });

  });
};
