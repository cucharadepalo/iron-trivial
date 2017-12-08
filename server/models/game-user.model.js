const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameUserSchema = new Schema({
  _gameId: { type: Schema.Types.ObjectId, ref: 'Game' },
  _userId: { type: Schema.Types.ObjectId, ref: 'User' },
  userAnswers: [{ type: Number, default: 0, required: true }],
  userPosition: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model("GameUser", gameUserSchema);
