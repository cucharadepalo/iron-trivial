const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameUserSchema = new Schema({
  _gameId: { type: Schema.Types.ObjectId, ref: 'Game' },
  _userId: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['open', 'playing', 'finished'], default: 'open'},
  score: { type: Number, default: 0 },
  questions: [
    {
      _questionId: {type: Schema.Types.ObjectId, ref: 'Question'},
      category: { type: String },
      guessed: { type: Boolean },
      score: { type: Number }
    }
  ],
  userPosition: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model("GameUser", gameUserSchema);
