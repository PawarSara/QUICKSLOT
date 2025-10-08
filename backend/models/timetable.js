// models/timetable.js
const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  faculty: { type: String, required: true },
  lecturesPerWeek: { type: Number, required: true },
});

const timetableSchema = new mongoose.Schema({
  year: { type: String, required: true },       // SE, TE, BE
  division: { type: String, required: true },   // A, B
  semester: { type: Number, required: true },   // 3-8 depending on year
  subjects: [subjectSchema],                    // array of subjects
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Timetable", timetableSchema);
