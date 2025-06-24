const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Questions = new Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String], // Correct way to define an array of strings
    required: true,
  },
  correctAnswer: {
    type: Number, // Index of the correct option (e.g., 0, 1, 2, 3)
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model('Question', Questions);
