const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const facultySchema = new Schema({
  name: {
    type: String,
    default: "",
  },
  emailID: {
    type: String,
    default: "",
  },
  eventType: {
    type: String,
    default: [],
  },
});

const FacultyCoordinator = mongoose.model("FacultyCoordinator", facultySchema)
module.exports = FacultyCoordinator;
