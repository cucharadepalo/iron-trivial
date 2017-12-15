const socketio = require('socket.io');
const Game = require('../models/game.model.js');
const User = require('../models/user.model.js');

let questionTimeOut = 3;
let currentQuestion = 0;
let startTimeOut = 1;
let lastTimeout = 3;

function sendNextQuestion(socket, game){
  console.log(`Broadcasting question ${game.questions[currentQuestion].id}, next in ${questionTimeOut}`);
  // check if game is ended
  if(currentQuestion < game.questions.length){
    // Next question
    let q = game.questions[currentQuestion];
    socket.broadcast.emit('question', {
      question: q,
      timeRemaining: questionTimeOut,
      questionIndex: currentQuestion
    });
    currentQuestion++;
    setTimeout(() =>{
      sendNextQuestion(socket, game);
    }, questionTimeOut * 1000);
  }else{
   // end game
   socket.broadcast.emit('calculate-game', {
     question: null,
     timeRemaining: 0,
     questionIndex: null,
   });
  }
}

module.exports = (app) =>{
  const io = socketio(app);

  io.on('connection', function (socket) {
    console.log(`Connected to SOCKETIO ${socket.id}`);
    
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });

    socket.on('init-game', function (data) {
      console.log(`El juego va a empezar`);
      Game.findById(data.gameId)
        .populate('questions')
        .then( game => {
          socket.broadcast.emit('start-game', {
            name: game.name,
            timeRemaining: startTimeOut
          });
          console.log(`Starting game in ${startTimeOut} sec`);
          setTimeout(() =>{
            sendNextQuestion(socket, game);
          }, startTimeOut * 1000);
        });
    });

    socket.on('join-game', function (data) {
      console.log(`Un usuario se ha unido`);
      User.findById(data.userId)
        .then( user => {
          socket.broadcast.emit('recibe-user', {
            username: user.username
          });
        });
    });

    socket.on('game-calculated', function (data) {
      console.log(`El juego ha sido calculado`);
      setTimeout(() => {
        Game.findById(data.gameID)
          .then(game => {
            socket.broadcast.emit('game-end', {
              ranking: game.ranking
            });
          });
      }, lastTimeout * 1000);
    });

  });
};
