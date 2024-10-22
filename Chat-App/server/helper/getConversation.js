const { ConversationModel } = require("../models/ConversationModel");

const getConversation = async (CurrentUserId) => {
  // console.log("CurrentUserId",CurrentUserId)
  if (!CurrentUserId) return []; // Early return if no user ID

  try {
    const CurrentUserConversation = await ConversationModel.find({
      $or: [
        { sender: CurrentUserId },
        { receiver: CurrentUserId },
      ],
    })
      .sort({ updatedAt: -1 })
      .populate("messages") // Populating messages
      .populate("sender")   // Populating sender details
      .populate("receiver"); // Populating receiver details

    const ConversationMsg = CurrentUserConversation.map((conv) => {
      const CountUnseenMsg = conv.messages.reduce((pre, curr) => {
        const msgByUserId = curr?.msgByUserId?.toString();
        return msgByUserId !== CurrentUserId ? pre + (curr.seen ? 0 : 1) : pre;
      }, 0); // Ensure to start with 0

      return {
        _id: conv?._id,
        sender: conv.sender, // This will be the full user object
        receiver: conv.receiver, // This will also be the full user object
        unseenMsg: CountUnseenMsg,
        lastMsg: conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null, // Last message or null
      };
    });

    return ConversationMsg;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

module.exports = getConversation;
