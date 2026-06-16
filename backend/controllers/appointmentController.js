const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");

// Book appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, timeSlot, type, symptoms, notes, isEmergency } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    // Check for slot conflict
    const conflict = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      status: { $in: ["pending", "confirmed"] },
    });
    if (conflict) {
      return res.status(400).json({ success: false, message: "This slot is already booked" });
    }

    // Generate meeting link for telemedicine
    const meetingLink = type === "telemedicine"
      ? `https://meet.healthcare.app/room/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      : "";

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      type: type || "in-person",
      symptoms,
      notes,
      isEmergency: isEmergency || false,
      meetingLink,
      amount: doctor.consultationFee,
    });

    const populated = await Appointment.findById(appointment._id)
      .populate("patient", "name email phone")
      .populate({ path: "doctor", populate: { path: "user", select: "name email" } });

    res.status(201).json({ success: true, appointment: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get patient's appointments
exports.getMyAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = { patient: req.user._id };
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate({ path: "doctor", populate: { path: "user", select: "name avatar" } })
      .skip(skip)
      .limit(Number(limit))
      .sort({ appointmentDate: -1 });

    res.status(200).json({ success: true, total, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor's appointments
exports.getDoctorAppointments = async (req, res) => {
  try {
    const { status, date, page = 1, limit = 10 } = req.query;
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor profile not found" });

    let query = { doctor: doctor._id };
    if (status) query.status = status;
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: start, $lte: end };
    }

    const skip = (page - 1) * limit;
    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate("patient", "name email phone avatar")
      .skip(skip)
      .limit(Number(limit))
      .sort({ appointmentDate: 1 });

    res.status(200).json({ success: true, total, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status, prescription, notes, cancellationReason } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, prescription, notes, cancellationReason },
      { new: true }
    ).populate("patient", "name email phone");

    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });
    res.status(200).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { reason } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

    if (appointment.patient.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    appointment.status = "cancelled";
    appointment.cancellationReason = reason || "";
    await appointment.save();
    res.status(200).json({ success: true, message: "Appointment cancelled", appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get available slots for a doctor on a date
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
    const daySlots = doctor.availableSlots.find((s) => s.day === dayName);

    if (!daySlots) return res.status(200).json({ success: true, slots: [] });

    // Generate time slots
    const slots = [];
    const [startH, startM] = daySlots.startTime.split(":").map(Number);
    const [endH, endM] = daySlots.endTime.split(":").map(Number);
    let current = startH * 60 + startM;
    const end = endH * 60 + endM;

    while (current + daySlots.slotDuration <= end) {
      const h = Math.floor(current / 60).toString().padStart(2, "0");
      const m = (current % 60).toString().padStart(2, "0");
      slots.push(`${h}:${m}`);
      current += daySlots.slotDuration;
    }

    // Filter out booked slots
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const booked = await Appointment.find({
      doctor: doctorId,
      appointmentDate: { $gte: start, $lte: endDate },
      status: { $in: ["pending", "confirmed"] },
    }).select("timeSlot");

    const bookedSlots = booked.map((a) => a.timeSlot);
    const available = slots.map((s) => ({ time: s, available: !bookedSlots.includes(s) }));

    res.status(200).json({ success: true, slots: available });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
