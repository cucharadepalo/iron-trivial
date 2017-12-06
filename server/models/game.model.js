const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  name: { type: String, default: 'Iron-trivia game' },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  ranking: [{
    position: { type: Number },
    user: { type: String },
    points: { type: Number }
  }
  ]
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at"}
});

module.exports = mongoose.model("Game", gameSchema);
