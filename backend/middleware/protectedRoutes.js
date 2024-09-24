import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

const protectedRoutes = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(404).json({ error: "no token found" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(404).json({ error: "Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password"); //why not using {}

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
export default protectedRoutes;
