const mongoose = require("mongoose");
const findOrCreate = require('mongoose-findorcreate');
const Schema = mongoose.Schema;
const CATEGORIES = require('./categories');

const userSchema = new Schema({
  username: { type: String, required: true },
  isAdmin : { type: Boolean, default: false },
  githubId: { type: String, default: null },
  facebookId: { type: String, default: null },
  questions: [{
    _questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
    category: { type: String },
    guessed: { type: Boolean }
  }],
  stats: {
    '1': { type: Number, required: true, default: 0 },
    '2': { type: Number, required: true, default: 0 },
    '3': { type: Number, required: true, default: 0 },
    '4': { type: Number, required: true, default: 0 },
    '5': { type: Number, required: true, default: 0 },
    '6': { type: Number, required: true, default: 0 }
  },
  gamesPlayed: { type: Number, required: true, default: 0 }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
        ret.id = ret._id;
        //delete ret.questions;
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
