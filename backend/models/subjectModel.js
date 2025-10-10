const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  year: { type: String, required: true },
  semester: { type: Number, required: true },
  division: { type: String, required: true },   // ✅ new field
  subjects: [
    {
      name: { type: String, required: true },
      hoursPerWeek: { type: Number, required: true },
    },
  ],
  code: { type: String, unique: true },         // unique for safety
});

module.exports = mongoose.model("Subject", subjectSchema);
