const express = require("express");
const router = express.Router();
const { addReview, getDoctorReviews } = require("../controllers/reviewController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

router.post("/", isAuthenticated, authorizeRoles("patient"), addReview);
router.get("/doctor/:doctorId", getDoctorReviews);

module.exports = router;
