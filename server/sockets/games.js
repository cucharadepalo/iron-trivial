const socketio = require('socket.io');
const Game = require('../models/game.model.js');
const User = require('../models/user.model.js');

let questionTimeOut = 10;
let currentQuestion = 0;
let startTimeOut = 1;

function sendNextQuestion(socket, game){
  //console.log(`Broadcasting question ${game.questions[currentQuestion].id}, next in ${questionTimeOut}`);
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
    //console.log(`Connected to SOCKETIO ${socket.id}`);

    socket.on('init-game', function (data) {
      //console.log(data.gameId);
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
      User.findById(data.userId)
        .then( user => {
          socket.broadcast.emit('recibe-user', {
            username: user.username
          });
        });
    });

  });
};
