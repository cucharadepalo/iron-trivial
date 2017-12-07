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
// pasar el método a las rutas (para poder hacerlo por categorías)
questionSchema.statics.random = function(cb) {
  this.count(function(err, count) {
    if (err) {
      return cb(err);
    }
    let rand = Math.floor(Math.random() * count);
    this.findOne().skip(rand).exec(cb);
  }.bind(this));
};

module.exports = mongoose.model('Question', questionSchema);
