const mongoose = require("mongoose");
const findOrCreate = require('mongoose-findorcreate');
const Schema = mongoose.Schema;
const CATEGORIES = require('./categories');

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin : { type: Boolean, default: false },
  githubId: { type: String },
  facebookId: { type: String },
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
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.password;
        delete ret.questions;
        delete ret.isAdmin;
        delete ret._id;
        delete ret.__v;
        delete ret.githubId;
        delete ret.facebookId;
        return ret;
    }
  }
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);
