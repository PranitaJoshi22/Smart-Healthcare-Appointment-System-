const Review = require("../models/Review");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

// Add review
exports.addReview = async (req, res) => {
  try {
    const { doctorId, appointmentId, rating, comment } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.status !== "completed") {
      return res.status(400).json({ success: false, message: "Can only review completed appointments" });
    }

    const existing = await Review.findOne({ appointment: appointmentId, patient: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: "Already reviewed this appointment" });
    }

    const review = await Review.create({
      doctor: doctorId,
      patient: req.user._id,
      appointment: appointmentId,
      rating,
      comment,
    });

    // Update doctor rating
    const reviews = await Review.find({ doctor: doctorId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Doctor.findByIdAndUpdate(doctorId, {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
    });

    const populated = await Review.findById(review._id).populate("patient", "name avatar");
    res.status(201).json({ success: true, review: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor reviews
exports.getDoctorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ doctor: req.params.doctorId })
      .populate("patient", "name avatar")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
