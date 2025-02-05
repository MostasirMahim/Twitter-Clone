import express from "express";
import {
  getMe,
  guestLogin,
  login,
  logout,
  signup,
} from "../controllers/auth.controllers.js";
import protectedRoutes from "../middleware/protectedRoutes.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/guestLogin", guestLogin);
router.post("/logout", logout);
router.get("/me", protectedRoutes, getMe);

export default router;
