import { v2 as cloudinary } from "cloudinary";
import Conversation from "./../models/conversation.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { text, receiverId } = req.body;
    let { images } = req.body;
    const senderId = req.user._id;
    if ((!text || text === "") && images?.length === 0)
      return res.status(400).json({ error: "Image or text is required" });
    let reciver = await User.findById(receiverId);
    if (!reciver) {
      return res.status(400).json({ error: "Oppnent not found" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    async function uploadImage(imgs) {
      try {
        if (imgs?.length > 0) {
          const uploadImage = await Promise.all(
            imgs.map(async (img) => {
              const upload = await cloudinary.uploader.upload(img);
              return upload.secure_url;
            })
          );
          images = uploadImage;
        }
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    }

    await uploadImage(images);
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      images: images || [],
    });
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) return res.status(201).json([]);

    const messages = conversation.messages;
    res.status(201).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCoversation = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) return res.status(201).json([]);

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatPeople = async (req, res) => {
  try {
    const senderId = req.user._id;
    if (!senderId) return res.status(400).json({ error: "No User Found" });
    const conversations = await Conversation.find({ participants: senderId });

    if (!conversations || conversations.length === 0)
      return res.status(201).json([]);

    const lastMessages = await Promise.all(
      conversations.map(async (conversation) => {
        const lastOne = conversation.messages[conversation.messages.length - 1];
        let message = await Message.findById(lastOne);

        let opponent;
        if (message) {
          const opponentId =
            message.senderId.toString() == senderId.toString()
              ? message.receiverId
              : message.senderId;
          opponent = await User.findById(opponentId)
            .select("fullname profileImg _id")
            .populate();
          if (!opponent) {
            opponent = await User.findById(opponentId)
              .select("fullname profileImg _id")
              .populate();
          }
        }
        const lastMessage = {
          ...message._doc,
          opponent,
        };
        return lastMessage;
      })
    );

    res.status(201).json(lastMessages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOthers = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ error: "User Not Found" });

    const others = await User.find({ _id: { $ne: userId } }).select(
      "fullname profileImg _id"
    );

    res.status(201).json(others);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
