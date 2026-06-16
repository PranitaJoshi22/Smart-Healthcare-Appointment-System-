const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    recordType: {
      type: String,
      enum: ["prescription", "lab-report", "scan", "discharge-summary", "other"],
      default: "other",
    },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    fileUrl: { type: String, default: "" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
