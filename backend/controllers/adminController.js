const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

// Dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalDoctors = await Doctor.countDocuments({ isApproved: true });
    const pendingDoctors = await Doctor.countDocuments({ isApproved: false });
    const totalAppointments = await Appointment.countDocuments();
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
    const todayAppointments = await Appointment.countDocuments({
      appointmentDate: { $gte: todayStart, $lte: todayEnd },
    });
    const completedAppointments = await Appointment.countDocuments({ status: "completed" });
    const cancelledAppointments = await Appointment.countDocuments({ status: "cancelled" });
    const revenue = await Appointment.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Monthly appointments for chart
    const monthly = await Appointment.aggregate([
      { $group: { _id: { month: { $month: "$appointmentDate" }, year: { $year: "$appointmentDate" } }, count: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalPatients,
        totalDoctors,
        pendingDoctors,
        totalAppointments,
        todayAppointments,
        completedAppointments,
        cancelledAppointments,
        revenue: revenue[0]?.total || 0,
        monthlyData: monthly,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve doctor
exports.approveDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isApproved: req.body.isApproved },
      { new: true }
    ).populate("user", "name email");
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    let query = {};
    if (role) query.role = role;
    const skip = (page - 1) * limit;
    const total = await User.countDocuments(query);
    const users = await User.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    res.status(200).json({ success: true, total, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all appointments (admin)
exports.getAllAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = {};
    if (status) query.status = status;
    const skip = (page - 1) * limit;
    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate("patient", "name email")
      .populate({ path: "doctor", populate: { path: "user", select: "name" } })
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, total, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
