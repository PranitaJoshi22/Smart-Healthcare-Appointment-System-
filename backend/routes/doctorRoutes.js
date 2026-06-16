const express = require("express");
const router = express.Router();
const { getAllDoctors, getDoctorById, updateDoctorProfile, getMyDoctorProfile, getSpecializations } = require("../controllers/doctorController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

router.get("/", getAllDoctors);
router.get("/specializations", getSpecializations);
router.get("/my-profile", isAuthenticated, authorizeRoles("doctor"), getMyDoctorProfile);
router.get("/:id", getDoctorById);
router.put("/update", isAuthenticated, authorizeRoles("doctor"), updateDoctorProfile);

module.exports = router;
