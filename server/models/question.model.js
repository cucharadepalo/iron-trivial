const mongoose = require('mongoose');
const random = require('mongoose-random');
const Schema = mongoose.Schema;
const CATEGORIES = require('./categories');

const questionSchema = new Schema({
  creator: { type: String },
  question: { type: String, required: true },
  questionImg: { type: String, default: null },
  questionIsImg: { type: Boolean, default: false },
  questionCode: { type: String, default: null},
  questionIsCode: { type: Boolean, default: false},
  category: { type: String, enum: CATEGORIES, required: true },
  correctAnswer: {type: String },
  fakeAnswers: [{ type: String, required: true }],
  approved: { type: Boolean, default: false }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.approved;
        delete ret._id;
        delete ret.__v;
        delete ret.random;
        return ret;
    }
  }
});

questionSchema.plugin(random, { path: 'random' });

module.exports = mongoose.model('Question', questionSchema);
