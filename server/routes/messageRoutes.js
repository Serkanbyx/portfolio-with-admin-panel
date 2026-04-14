const express = require("express");
const { getMessages, markAsRead, deleteMessage } = require("../controllers/messageController");
const { protect, adminOnly } = require("../middlewares/auth");

const router = express.Router();

router.use(protect, adminOnly);

router.get("/", getMessages);
router.patch("/:id/read", markAsRead);
router.delete("/:id", deleteMessage);

module.exports = router;
