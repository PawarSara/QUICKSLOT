const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  year: { type: String, required: true },       // "SE", "TE", "BE"
  division: { type: String },                   // "A", "B" (optional)
  name: { type: String, required: true },
  code: { type: String, required: true },
  hoursPerWeek: { type: Number, required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" } // reference to Faculty
});

module.exports = mongoose.model("Subject", subjectSchema);
