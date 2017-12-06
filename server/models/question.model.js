const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CATEGORIES = require('./categories');

const questionSchema = new Schema({
  creator: { type: String },
  question: { type: String, required: true },
  questionImg: { type: String, default: null },
  questionIsImg: { type: String, default: false },
  questionCode: { type: String, default: null},
  questionIsCode: { type: Boolean, default: false},
  category: { type: String, enum: CATEGORIES, required: true },
  correctAnswer: {type: String },
  fakeAnswers: [{ type: String, required: true }],
  approved: { type: Boolean, default: false }
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at"}
});

module.exports = mongoose.model('Question', questionSchema);
