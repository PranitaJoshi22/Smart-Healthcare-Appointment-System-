const express = require("express");
const router = express.Router();
const {
  bookAppointment, getMyAppointments, getDoctorAppointments,
  updateAppointmentStatus, cancelAppointment, getAvailableSlots,
} = require("../controllers/appointmentController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

router.get("/slots", getAvailableSlots);
router.post("/book", isAuthenticated, authorizeRoles("patient"), bookAppointment);
router.get("/my", isAuthenticated, authorizeRoles("patient"), getMyAppointments);
router.get("/doctor", isAuthenticated, authorizeRoles("doctor"), getDoctorAppointments);
router.put("/:id/status", isAuthenticated, authorizeRoles("doctor", "admin"), updateAppointmentStatus);
router.put("/:id/cancel", isAuthenticated, cancelAppointment);

module.exports = router;
