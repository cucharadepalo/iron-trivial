const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'Iron-trivia game', required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  status: { type: String, enum: ['open', 'playing', 'finished'], default: 'open'},
  ranking: [{
    user: { type: String },
    score: { type: Number }
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
