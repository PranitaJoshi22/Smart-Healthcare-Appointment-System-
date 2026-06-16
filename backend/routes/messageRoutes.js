const express = require("express");
const router = express.Router();
const { sendMessage, getConversation, getInbox } = require("../controllers/messageController");
const { isAuthenticated } = require("../middleware/auth");

router.use(isAuthenticated);
router.post("/", sendMessage);
router.get("/inbox", getInbox);
router.get("/:userId", getConversation);

module.exports = router;
