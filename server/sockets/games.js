const socketio = require('socket.io');
const Game = require('../models/game.model.js');
const User = require('../models/user.model.js');

module.exports = (app) =>{
  const io = socketio(app);

  io.on('connection', function (socket) {
    console.log(`Connected to SOCKETIO ${socket.id}`);

    socket.on('init-game', function (data) {
      console.log(data.gameId);
      Game.findById(data.gameId)
        .then( game => {
          console.log(game);
          socket.broadcast.emit('start-game', {
            name: game.name
          });
        });
    });

    socket.on('join-game', function (data) {
      console.log(data.userId);
      User.findById(data.userId)
        .then( user => {
          console.log(user);
          socket.broadcast.emit('recibe-user', {
            username: user.username
          });
        });

    });
  });
};
