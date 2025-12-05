const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  actor: { type: String, required: true }, // Who did it?
  action: { type: String, required: true }, // What did they do?
  target: { type: String }, // Whom did they affect?
  details: { type: String }, // Extra info
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Activity", activitySchema);
