const express = require("express");
const router = express.Router();
const { getDashboardStats, approveDoctor, getAllUsers, deleteUser, getAllAppointments } = require("../controllers/adminController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

router.use(isAuthenticated, authorizeRoles("admin"));

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/doctors/:id/approve", approveDoctor);
router.get("/appointments", getAllAppointments);

module.exports = router;
