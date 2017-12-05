const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CATEGORIES = require('./categories');

const questionSchema = new Schema({
      creator: {
        type: String
      },
      question: {
        type: String,
        required: true
      },
      questionImg: {
        type: String,
        default: null
      },
      questionisImg {
        type: String,
        default: false,
      },
      questionCode: {
        type: String,
        default: null
      },
      questionIsCode: {
        type: Boolean,
        default: false
      },
      categories: {
        type: String,
        enum: CATEGORIES,
        required: true
      },
      approved: {
        type: Boolean,
        default: false
      },
      answers: [{
        content: {
          type: String,
          required: true
        },
        right: {
          type: Boolean,
          required: true
        }
      }],
      {
        timestamps: {
          createdAt: "created_at",
          updatedAt: "updated_at"
        }
      });

    module.exports = mongoose.model('Question', chunkSchema);
