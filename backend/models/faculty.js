const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  subjects: [{ type: String }], // array of subject codes they teach
});

module.exports = mongoose.model("Faculty", facultySchema);
