import e from "express";
import protectedRoutes from "../middleware/protectedRoutes.js";
import {
  commentPost,
  createPost,
  deletePost,
  getAllPost,
  getFollowingPosts,
  getLikedPost,
  getPostsByUserComments,
  getPostWithDetails,
  getUsersPost,
  likePost,
} from "../controllers/post.controller.js";

const router = e.Router();

router.post("/create", protectedRoutes, createPost);
router.delete("/:id", protectedRoutes, deletePost);
router.post("/comment/:id", protectedRoutes, commentPost);
router.post("/likes/:id", protectedRoutes, likePost);
router.get("/all", protectedRoutes, getAllPost);
router.get("/likedpost/:id", protectedRoutes, getLikedPost);
router.get("/myposts/:id", protectedRoutes, getUsersPost);
router.get("/followingpost", protectedRoutes, getFollowingPosts);
router.get("/:id", protectedRoutes, getPostWithDetails);
router.get("/replies/:id", protectedRoutes, getPostsByUserComments);
export default router;
