const Doctor = require("../models/Doctor");
const User = require("../models/User");

// Get all approved doctors with filters
exports.getAllDoctors = async (req, res) => {
  try {
    const { specialization, city, name, minFee, maxFee, rating, page = 1, limit = 10 } = req.query;

    let userQuery = {};
    if (name) userQuery.name = { $regex: name, $options: "i" };
    if (city) userQuery["address.city"] = { $regex: city, $options: "i" };

    const users = await User.find({ ...userQuery, role: "doctor" }).select("_id");
    const userIds = users.map((u) => u._id);

    let doctorQuery = { user: { $in: userIds } };  // Removed isApproved filter for dev
    if (specialization) doctorQuery.specialization = { $regex: specialization, $options: "i" };
    if (minFee) doctorQuery.consultationFee = { $gte: Number(minFee) };
    if (maxFee) doctorQuery.consultationFee = { ...doctorQuery.consultationFee, $lte: Number(maxFee) };
    if (rating) doctorQuery.rating = { $gte: Number(rating) };

    const skip = (page - 1) * limit;
    const total = await Doctor.countDocuments(doctorQuery);
    const doctors = await Doctor.find(doctorQuery)
      .populate("user", "name email avatar phone gender address")
      .skip(skip)
      .limit(Number(limit))
      .sort({ rating: -1 });

    res.status(200).json({ success: true, total, doctors, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single doctor
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "user",
      "name email avatar phone gender address"
    );
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update doctor profile (doctor only)
exports.updateDoctorProfile = async (req, res) => {
  try {
    const { specialization, qualification, experience, consultationFee, hospital, bio, languages, availableSlots, telemedicineEnabled } = req.body;
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { specialization, qualification, experience, consultationFee, hospital, bio, languages, availableSlots, telemedicineEnabled },
      { new: true, runValidators: true }
    ).populate("user", "name email avatar");
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor's own profile
exports.getMyDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id }).populate(
      "user",
      "name email avatar phone gender"
    );
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor profile not found" });
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get specializations list
exports.getSpecializations = async (req, res) => {
  try {
    const specs = await Doctor.distinct("specialization");
    res.status(200).json({ success: true, specializations: specs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
