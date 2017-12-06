const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  _gameId = { type: Schema.Types.ObjectId, ref: 'Game' },
  _userId = { type: Schema.Types.ObjectId, ref: 'User' },
  userPosition = Number, 
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at"}
});

module.exports = mongoose.model("Game", gameSchema);
