const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    appointmentDate: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    type: { type: String, enum: ["in-person", "telemedicine"], default: "in-person" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "no-show"],
      default: "pending",
    },
    symptoms: { type: String, default: "" },
    notes: { type: String, default: "" },
    prescription: { type: String, default: "" },
    meetingLink: { type: String, default: "" },
    isEmergency: { type: Boolean, default: false },
    cancellationReason: { type: String, default: "" },
    reminderSent: { type: Boolean, default: false },
    amount: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
