import e from "express";
import protectedRoutes from "./../middleware/protectedRoutes.js";
import {
  followUnfollow,
  getFollowings,
  getProfile,
  getUser,
  suggestedUsers,
  updateProfile,
} from "../controllers/user.controller.js";
const router = e.Router();

router.get("/profile/:id", protectedRoutes, getProfile);
router.get("/follow/:id", protectedRoutes, followUnfollow);
router.get("/suggetion", protectedRoutes, suggestedUsers);
router.post("/update/:id", protectedRoutes, updateProfile);
router.get("/following", protectedRoutes, getFollowings);
router.get("/user/:username", protectedRoutes, getUser);

export default router;
