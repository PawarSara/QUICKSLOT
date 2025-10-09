// backend/models/subjectModel.js
const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  semester: { type: String, required: true },
  subjects: [
    {
      name: String,
      hoursPerWeek: Number,
    },
  ],
});

module.exports = mongoose.model("Subject", subjectSchema);

