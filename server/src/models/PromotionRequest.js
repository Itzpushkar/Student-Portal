const mongoose = require("mongoose");

const promotionRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  enrollmentNo: { type: String, required: true },
  currentSemester: { type: Number, required: true },
  requestedSemester: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  remarks: String, // Admin remarks
  requestDate: { type: Date, default: Date.now },
  reviewDate: Date,
});

module.exports = mongoose.model("PromotionRequest", promotionRequestSchema);
