const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsFomToken = require("../helper/getuserDetailsFomToken");
const userModel = require("../models/UserModel");
const {
  ConversationModel,
  MessageModel,
} = require("../models/ConversationModel");
const getConversation = require("../helper/getConvesation");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Online user set
let onlineUsers = new Set();

// Socket.io events
io.on("connection", async (socket) => {
  // console.log( "sockey",socket.id)
  const token = socket.handshake.auth.token;
  const user = await getUserDetailsFomToken(token);
  //console.log( "user",user)

  if (user) {
    // Join the socket to a room for this user
    socket.join(user?._id?.toString());
    onlineUsers.add(user._id?.toString());

    // Notify all clients about the updated online users
    io.emit("onlineUsers", Array.from(onlineUsers));
    //console.log("onlineUsers=>", onlineUsers);

    // Emit an event to the specific user for their messages
    socket.on("message-page", async (userId) => {
      // console.log("userId", userId)
      const UserDetails = await userModel.findById(userId).select("-password");
      const payload = {
        _id: UserDetails?._id,
        name: UserDetails?.name,
        email: UserDetails?.email,
        profile_pic: UserDetails?.profile_pic,
        online: onlineUsers.has(userId),
      };
      socket.emit("message-page", payload);

      //get convertiones
      const getConversationMessage = await ConversationModel.findOne({
        $or: [
          { sender: user?._id, receiver: userId },
          { sender: userId, receiver: user?._id },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      socket.emit("message", getConversationMessage);
      socket.emit("seenData", userId);
      //    console.log("getConversationMessage", getConversationMessage);
    });

    //new new-message
    socket.on("new-message", async (data) => {
      let conversation = await ConversationModel.findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { receiver: data?.sender, sender: data?.receiver },
        ],
      });

      if (!conversation) {
        const newConversation = await ConversationModel({
          sender: data?.sender,
          receiver: data?.receiver,
        });
        conversation = await newConversation.save();
      }
      //save message in conversation
      const newMessage = await MessageModel({
        text: data.text,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        msgByUserId: data?.msgByUserId,
      });

      const saveMessage = await newMessage.save();

      // console.log("Message saved:", saveMessage);
      //yha tk correct hia new chat a rhi hai

      const updateConversation = await ConversationModel.updateOne(
        { _id: conversation?._id },
        { $push: { messages: saveMessage?._id } }
      );

      //update tk bhi thi hai
      // console.log("Update result:", updateConversation);

      const getConversationMessage = await ConversationModel.findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      io.to(data?.sender).emit("message", getConversationMessage);
      io.to(data?.receiver).emit("message", getConversationMessage);


      //send convertion message 

      const ConversationSender=await getConversation(data?.sender)
      const ConversationReceiver=await getConversation(data?.receiver)

      io.to(data?.sender).emit("ConversationMsg", ConversationSender);
      io.to(data?.receiver).emit("ConversationMsg", ConversationReceiver);

   
    });

    ///latestUserSideBar

    socket.on("latestUserSideBar", async (CurrentUserId) => {
   // console.log("latestUserSideBar",CurrentUserId);
   
   const ConversationMsg=await getConversation(CurrentUserId)
        socket.emit("ConversationMsg", ConversationMsg);

   
   
     
    });
    //socket onseen data

    socket.on("seenData", async(msgByUserId) => {
   // console.log(msgByUserId)
 const conversation=await ConversationModel.findOne({
   $or: [
     { sender: user._id, receiver: msgByUserId },
     { sender: msgByUserId, receiver: user._id },
   ],
 })
   // console.log(conversation)  
 const conversationMessageId=conversation?.messages||[]

 await MessageModel.updateMany(

  {_id: { "$in": conversationMessageId },msgByUserId:  msgByUserId },{ "$set":{seen:true}})

       const ConversationSender=await getConversation(user._id?.toString())
      const ConversationReceiver=await getConversation(msgByUserId)

      io.to(user._id?.toString()).emit("ConversationMsg", ConversationSender);
      io.to(msgByUserId).emit("ConversationMsg", ConversationReceiver);


      
    });

    //user typing chat
    socket.on("userTyping", (typingId) => {
      socket.broadcast.emit("StartTyping", typingId);
    });
    

    // Handle socket disconnection
    socket.on("disconnect", () => {
      if (user) { // Ensure user is defined
        onlineUsers.delete(user._id.toString());
        io.emit("offlineUser", user._id); // Emit the offline user event
      //  console.log("User disconnected:", user._id);
      //  console.log("Updated online users:", Array.from(onlineUsers)); // Log the current online users
      }
    });
  }
});

module.exports = {
  app,
  server,
};
