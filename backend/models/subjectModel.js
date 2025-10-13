// backend/models/subjectModel.js
const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  year: { type: String, required: true },
  semester: { type: Number, required: true },
  subjectName: { type: String, required: true },
  hoursPerWeek: { type: Number, required: true },
});

module.exports = mongoose.model("Subject", subjectSchema);


