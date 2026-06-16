const Message = require("../models/Message");
const User = require("../models/User");

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content, appointmentId } = req.body;
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content,
      appointment: appointmentId || null,
    });
    const populated = await Message.findById(message._id)
      .populate("sender", "name avatar role")
      .populate("receiver", "name avatar role");
    res.status(201).json({ success: true, message: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get conversation
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    })
      .populate("sender", "name avatar role")
      .populate("receiver", "name avatar role")
      .sort({ createdAt: 1 });

    // Mark as read
    await Message.updateMany(
      { sender: userId, receiver: req.user._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all conversations (inbox)
exports.getInbox = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate("sender", "name avatar role")
      .populate("receiver", "name avatar role")
      .sort({ createdAt: -1 });

    // Get unique conversations
    const seen = new Set();
    const conversations = [];
    for (const msg of messages) {
      const otherId =
        msg.sender._id.toString() === req.user._id.toString()
          ? msg.receiver._id.toString()
          : msg.sender._id.toString();
      if (!seen.has(otherId)) {
        seen.add(otherId);
        const unread = await Message.countDocuments({
          sender: otherId,
          receiver: req.user._id,
          isRead: false,
        });
        conversations.push({ ...msg.toObject(), unreadCount: unread });
      }
    }

    res.status(200).json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
