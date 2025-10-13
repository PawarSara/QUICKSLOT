 // models/timetable.js
const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  year: { type: String, required: true },      // ✅ re-add this
  semester: { type: Number, required: true },
  division: { type: String, required: true },
  timetable: { type: Object, required: true }, // stores the timetable JSON
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Timetable", timetableSchema);

