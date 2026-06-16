const express = require("express");
const router = express.Router();
const { getHealthNews } = require("../controllers/newsController");

router.get("/", getHealthNews);

module.exports = router;
