const express = require("express");
const router = express.Router();
const { checkSymptoms, getSymptomList } = require("../controllers/symptomController");

router.get("/list", getSymptomList);
router.post("/check", checkSymptoms);

module.exports = router;
