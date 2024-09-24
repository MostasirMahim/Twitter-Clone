import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const genToken = async (userId, res) => {
  const Token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  res.cookie("jwt", Token, {
    maxAge: 1000 * 60 * 60 * 24 * 15,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
};
