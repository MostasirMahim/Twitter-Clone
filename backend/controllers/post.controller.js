import e from "express";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User Not found" });

    if (typeof text != "string")
      return res.status(400).json({ error: "Text must be string" });

    if (!text && !img)
      return res.status(400).json({ error: "post must be have text or img" });

    if (img) {
      const imgupoloder = await cloudinary.uploader.upload(img);
      img = imgupoloder.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text: text || "",
      img: img || null,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const post = await Post.findById(postId);

    if (post.user.toString() !== userId.toString())
      return res.status(400).json({ error: "U have no access" });

    if (post.img) {
      //destroy img in cloudinary
    }

    await Post.findByIdAndDelete(postId);
    res.status(201).json({ massege: "Post deleted successfuly" });
  } catch (error) {
    console.log(error);
  }
};

export const commentPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const { text } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User Not found" });

    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ error: "Post Not found" });
    if (text == "") return res.status(400).json({ error: "Text Not found" });

    const comment = {
      user: userId,
      text,
    };
    post.comments.push(comment);
    await post.save();
    const notifications = new Notification({
      from: req.user._id,
      to: post.user,
      type: "comment",
      comment: text,
      content: postId,
    });
    notifications.save();

    res.status(201).json(comment);
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User Not found" });

    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ error: "Post Not found" });

    const likedPost = post.likes.includes(userId);

    if (likedPost) {
      //unlike the post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      const updateLikes = post.likes.filter(
        (like) => like._id.toString() !== user._id.toString()
      );
      res.status(201).json(updateLikes);
    } else {
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      const notifications = new Notification({
        from: req.user._id,
        to: post.user,
        type: "like",
        content: postId,
      });
      notifications.save();

      const updateLikes = post.likes;
      res.status(201).json(updateLikes);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" }); //newt added post comments and liked users
    if (posts.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
  }
};

export const getLikedPost = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ massege: "User Not Found" });

    const likedposts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password", //cheak without password deselction option
      });
    res.status(200).json(likedposts);
  } catch (error) {
    console.log(error);
  }
};

export const getUsersPost = async (req, res) => {
  try {
    //try with usrname  const username = req.params.username;

    const userId = req.params.id;
    const posts = await Post.find({ user: userId }) //user user checkings
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const following = user.following;
    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).json(feedPosts);
  } catch (error) {
    console.log("Error in getFollowingPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPostWithDetails = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate({
        path: "user", // Populate the user field
        select: "username email profileImg fullname", // Select fields to return
      })
      .populate({
        path: "comments.user", // Populate the user field within comments
        select: "username profileImg fullname", // Select fields to return
      });
    if (!post) return res.status(404).json({ error: "Post Not Found" });

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
  }
};

export const getPostsByUserComments = async (req, res) => {
  try {
    const userId = req.params.id; // Get user ID from request params

    const posts = await Post.find({ "comments.user": userId })
      .populate("user")
      .populate("comments.user");

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};
