const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  weightage: { type: Number, required: true },
});

const timetableSchema = new mongoose.Schema({
  deadline: { type: Date, required: true },
  hoursPerDay: { type: Number, required: true },
  subjects: [subjectSchema],
});

module.exports = mongoose.model("Timetable", timetableSchema);
