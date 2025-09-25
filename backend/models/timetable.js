const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  year: { type: String, required: true },       // "SE", "TE", "BE"
  division: { type: String },                   // "A", "B" (optional)

  // slots as Map: { "Mon-1": { subject, faculty } }
  slots: {
    type: Map,
    of: new mongoose.Schema({
      subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
      faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" }
    }),
    default: {}
  }
});

module.exports = mongoose.model("Timetable", timetableSchema);
