const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'Iron-trivia game', required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  isInPlay: { type: Boolean, default: false, required: true },
  isFinished: { type: Boolean, default: false, required: true },
  ranking: [{
    position: { type: Number },
    user: { type: String },
    points: { type: Number }
  }]
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
  }
});

module.exports = mongoose.model("Game", gameSchema);
