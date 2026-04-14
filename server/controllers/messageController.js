const Message = require("../models/Message");

const getMessages = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.isRead === "true") filter.isRead = true;
    if (req.query.isRead === "false") filter.isRead = false;

    const messages = await Message.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    res.json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    res.json({ success: true, message: "Message deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMessages, markAsRead, deleteMessage };
