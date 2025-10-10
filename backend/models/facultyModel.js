// backend/models/facultyModel.js
const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  facultyName: {
    type: String,
    required: true,
    trim: true,
  },
  subjects: {
    type: [String], // Array of subjects
    required: true,
  },
});

module.exports = mongoose.model("Faculty", facultySchema);
