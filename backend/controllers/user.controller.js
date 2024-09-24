import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ error: "User Not Found" });
    res.status(201).json(user);
  } catch (e) {
    console.log(e);
  }
};

export const suggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const followedByMe = await User.findById(userId).select("following");
    const users = await User.aggregate([
      {
        $match: {
          _id: {
            $ne: userId,
          },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) => !followedByMe.following.includes(user._id)
    );
    const suggestedusers = filteredUsers.slice(0, 4);
    suggestedusers.forEach((user) => (user.password = null));
    res.status(200).json(suggestedusers);
  } catch (error) {
    console.log(error);
  }
};

export const followUnfollow = async (req, res) => {
  try {
    const { id } = req.params;
    const whoToFollow = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (!whoToFollow && !currentUser)
      return res.status(400).json({ error: "user not found" });

    if (id === currentUser._id.toString()) {
      return res.status(400).json({ error: "You can't follow yourself" });
    }

    const alreadyFollowing = currentUser.following.includes(id);
    if (alreadyFollowing) {
      //Unfollow
      await User.findByIdAndUpdate(id, {
        $pull: { followers: currentUser._id },
      });
      await User.findByIdAndUpdate(currentUser._id, {
        $pull: { following: id },
      });
      res.status(200).json({ message: "User unfollowed Succesfully" });
    } else {
      //follow
      await User.findByIdAndUpdate(id, {
        $push: { followers: currentUser._id },
      });
      await User.findByIdAndUpdate(currentUser._id, {
        $push: { following: id },
      });

      const notifications = new Notification({
        from: req.user._id,
        to: id,
        type: "follow",
      });
      notifications.save();

      res.status(200).json({ message: "User followed Succesfully" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      fullname,
      username,
      email,
      oldPassword,
      newPassword,
      link,
      Bio,
      DateOfBirth,
      Location,
    } = req.body;
    let { profileImg, coverImg } = req.body;
    const { id } = req.params;
    if (id != req.user._id)
      return res.status(401).json({ message: "It's not your Profile" });
    let user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email) {
      const emailregex = /^\S+@\S+\.\S+$/;
      if (!emailregex.test(email))
        return res.status(400).json({ error: "Email Not Valid" });
    }

    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername)
        return res.status(400).json({ error: "Username Already Used" });
    }

    if (oldPassword && newPassword) {
      const correctPassword = await bcrypt.compare(
        oldPassword,
        user?.password || ""
      );
      if (!correctPassword)
        return res.status(400).json({ error: " Wrong Password " });
      if (newPassword.length < 6)
        return res.status(400).json({ error: "Password minimum 6 character" });

      const salt = await bcrypt.getSalt(10);
      const hashP = await bcrypt.hash(newPassword, salt);
      user.password = hashP;
    }
    if (profileImg) {
      if (user.profileImg) {
        //deleted existing Image
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      //Upload a new Image

      const uploadResult = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadResult.secure_url;
    }
    if (coverImg) {
      if (user.coverImg) {
        //deleted existing Image
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      //Upload a new Image
      const uploadResult = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadResult.secure_url;
    }
    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.username = username || user.username;
    user.link = link || user.link;
    user.Bio = Bio || user.Bio;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;
    user.Location = Location || user.Location;
    user.DateOfBirth = DateOfBirth || user.DateOfBirth;

    await user.save();

    user.password = null;
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};

export const getFollowings = async (req, res) => {
  try {
    const userId = req.user._id;

    const followingUser = await User.findById(userId)
      .select("-password")
      .populate({
        path: "following",
        select: "-password",
      })
      .populate({
        path: "followers",
        select: "-password",
      });
    res.status(200).json(followingUser);
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");
    if (!user) return res.status(404).json("User not found");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};
