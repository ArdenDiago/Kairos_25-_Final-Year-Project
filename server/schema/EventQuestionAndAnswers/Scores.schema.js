const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Scores = new Schema({
    event: {
        type: String,
        required: true,
    },
    teamName: {
        type: String,
        required: true,
    },
    answers: [
        {
            type: Map,
            of: Number, // key = questionIndex, value = selectedAnswerIndex
            required: true,
        },
    ],
    timestamp: {
        type: Date,
        required: true,
    },
    duration: { // in seconds or milliseconds? Make it clear
        type: Number,
        default: 0,
    },
    totalQuestions: {
        type: Number,
        default: 0,
    },
    correctAnswers: {
        type: Number,
        default: 0,
    },
    accuracyScore: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('EventScores', Scores);
