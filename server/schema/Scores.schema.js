const mongoose = require("mongoose");
const { Schema } = mongoose;

const participantSchema = new Schema({
  id: Number, 
  name: String,
  email: String,
  collegeCode: String,
  roundScores: {
    type: Map,
    of: Number, // Stores each round's score as a number
    default: {} // Ensures it's always an object
  },
});

const scoreSchema = new Schema(
  {
    coordinator: String,
    id: String,
    name: String,
    participants: [participantSchema], // Store an array of participants
    rounds: [String], // Store all round names separately
    studentSubmitted: { type: Boolean, default: false },
    facultySubmitted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Score", scoreSchema);
