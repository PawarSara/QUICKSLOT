const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  year: { type: String, required: true },     // e.g., "SE", "TE", "BE"
  semester: { type: Number, required: true }, // semester number if needed
  division: { type: String },                 // optional, e.g. "A"
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  faculty: { type: String },                  // default faculty for subject (optional)
  lecturesPerWeek: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subject', SubjectSchema);
