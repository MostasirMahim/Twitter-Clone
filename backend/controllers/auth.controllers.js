import e from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { genToken } from "../lib/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;
    const defaultCP =
      "https://res.cloudinary.com/dzdszuszh/image/upload/v1727177470/flowers-1835619_1280_v0tkvi.jpg";
    const defaultDP =
      "https://res.cloudinary.com/dzdszuszh/image/upload/v1727177253/transparent-cartoon-cat-1711074058354_inkxok.webp";

    if (fullname === "")
      return res.status(400).json({ error: "Provide Full Name" });

    const emailregex = /^\S+@\S+\.\S+$/;
    if (!emailregex.test(email))
      return res.status(400).json({ error: "Email Not Valid" });

    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ error: "Email Already Used" });

    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(400).json({ error: "Username Already Used" });

    if (password.length < 6)
      return res.status(400).json({ error: "Password minimum 6 character" });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashPassword,
      profileImg: defaultDP,
      coverImg: defaultCP,
    });
    if (newUser) {
      genToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
        followers: newUser.followers,
        following: newUser.following,
      });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid user data" });
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User Not Found" });
    if (password.length < 6)
      return res
        .status(400)
        .json({ error: "Password needs minimum 6 characters" });

    const correctPassword = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (correctPassword !== true)
      return res
        .status(400)
        .json({ error: "email or Password is not correct" });

    await genToken(user._id, res);

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
      followers: user.followers,
      following: user.following,
    });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(201).json({ message: "Logout successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
};
