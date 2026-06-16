const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    specialization: { type: String, required: true },
    qualification: [{ type: String }],
    experience: { type: Number, default: 0 },
    consultationFee: { type: Number, default: 500 },
    hospital: { type: String, default: "" },
    bio: { type: String, default: "" },
    languages: [{ type: String }],
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    availableSlots: [
      {
        day: {
          type: String,
          enum: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        },
        startTime: { type: String },
        endTime: { type: String },
        slotDuration: { type: Number, default: 30 }, // minutes
      },
    ],
    offDays: [{ type: Date }],
    telemedicineEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
