const mongoose = require("mongoose");

const broadcastSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  senderName: { type: String }, // Stores Admin Name at time of sending

  // Targeting Logic
  targetAudience: {
    branch: { type: String, default: "All" }, // 'Computer', 'All', etc.
    semester: { type: String, default: "All" }, // '1', 'All', etc.
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Broadcast", broadcastSchema);
