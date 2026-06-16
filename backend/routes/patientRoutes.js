const express = require("express");
const router = express.Router();
const MedicalRecord = require("../models/MedicalRecord");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

// Get patient medical records
router.get("/records", isAuthenticated, authorizeRoles("patient", "doctor"), async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.user._id })
      .populate("doctor", "specialization")
      .sort({ date: -1 });
    res.status(200).json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add medical record
router.post("/records", isAuthenticated, async (req, res) => {
  try {
    const { title, description, recordType, fileUrl, appointmentId, doctorId } = req.body;
    const record = await MedicalRecord.create({
      patient: req.user._id,
      doctor: doctorId || null,
      appointment: appointmentId || null,
      title,
      description,
      recordType: recordType || "other",
      fileUrl: fileUrl || "",
    });
    res.status(201).json({ success: true, record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete record
router.delete("/records/:id", isAuthenticated, async (req, res) => {
  try {
    await MedicalRecord.findOneAndDelete({ _id: req.params.id, patient: req.user._id });
    res.status(200).json({ success: true, message: "Record deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
