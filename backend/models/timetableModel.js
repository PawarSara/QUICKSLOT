// models/timetable.js
const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  semester: String,
  division: String,
  timetable: Object, // stores the timetable JSON
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Timetable", timetableSchema);

