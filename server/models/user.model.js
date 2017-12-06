const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CATEGORIES = require('./categories');

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  questions: [{
    _questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
    category: { type: String },
    guessed: { type: Boolean }
  }],
  stats: {
    '1': Number,
    '2': Number,
    '3': Number,
    '4': Number,
    '5': Number,
    '6': Number
  },
  gamesPlayed: { type: Number}
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at"}
});

module.exports = mongoose.model("User", userSchema);
