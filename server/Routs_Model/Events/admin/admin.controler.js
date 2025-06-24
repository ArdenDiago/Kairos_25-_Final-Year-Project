const { readQuestions, writeScores, readAnswers } = require('../../../Data_Model/EventsQuestions/ITManager.data');
const { readEventScores } = require('../../../Data_Model/EventsQuestions/scores.data');

async function getUserScores(req, res) {
  try {
    const event = req.params.event;
    const questions = await readEventScores(event);
    console.log("Questions are: ", questions);
    return res.status(200).json(questions);
  } catch (err) {
    console.error("Error in getting the questions? ");
    return res.status(500).json(String(err));
  }
}

/*
answers: {0: 0, 1: 1, 2: 1, 3: 2, 4: 2}
duration: 7
teamName: "adfe"
timestamp: "2025-05-18T15:59:10.781Z"
totalQuestions: 5
*/

async function postAnswers(req, res) {
  try {
    const event = req.params.event;
    const { answers, duration, teamName, timestamp, totalQuestions } = req.body;

    // Validate input
    if (!answers || !duration || !teamName || !timestamp || !totalQuestions) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log("Answers are: ", answers);

    // Fetch questions to calculate score
    const questionsAnswers = await readAnswers(event);

    console.log("Answers Are: ", questionsAnswers);

    // Calculate score
    let correctAnswers = 0;
    for (let i = 0; i < totalQuestions; i++) {
      if (questionsAnswers[i].correctAnswer === answers[i]) {
        correctAnswers++;
      }
    }

    const accuracyScore = ((correctAnswers / totalQuestions) * 100).toFixed(2);

    // Save submission
    const submission = {
      event,
      teamName,
      answers,
      timestamp: new Date(timestamp),
      duration,
      totalQuestions,
      correctAnswers,
      accuracyScore,
    };

    console.log("Submission is: ", submission, typeof accuracyScore);

    const savedSubmission = await insertScore(submission);

    if (!savedSubmission) {
      return res.status(500).json({ error: 'Failed to save submission' });
    }
    
    res.status(201).json({ message: 'Submission successful' });
  } catch (err) {
    console.error('Error submitting answers:', err);
    res.status(500).json({ error: 'Failed to submit answers' });
  }
}

module.exports = {
  getUserScores,
  postAnswers
}


/*

const express = require('express');
const mongoose = require('mongoose.Concurrent');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/itmanager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Question Schema
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: Number,
    required: true,
  },
});

const Question = mongoose.model('Question', questionSchema);

// Submission Schema
const submissionSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
  answers: [{
    questionIndex: {
      type: Number,
      required: true,
    },
    selectedAnswer: {
      type: String,
      required: true,
    },
  }],
  timestamp: {
    type: Date,
    required: true,
  },
  score: {
    type: Number,
  },
});

const Submission = mongoose.model('Submission', submissionSchema);

// Get all questions
app.get('/events/ITManager', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Submit answers
app.post('/events/ITManager/submit', async (req, res) => {
  try {
    const { teamName, answers, timestamp } = req.body;

    // Validate input
    if (!teamName || !answers || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch questions to calculate score
    const questions = await Question.find();
    let score = 0;

    answers.forEach((answer) => {
      const question = questions[answer.questionIndex];
      if (question && question.options[question.correctAnswer] === answer.selectedAnswer) {
        score++;
      }
    });

    // Save submission
    const submission = new Submission({
      teamName,
      answers,
      timestamp: new Date(timestamp),
      score,
    });

    await submission.save();
    res.status(201).json({ message: 'Submission successful', score, totalQuestions: questions.length });
  } catch (err) {
    console.error('Error submitting answers:', err);
    res.status(500).json({ error: 'Failed to submit answers' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

*/