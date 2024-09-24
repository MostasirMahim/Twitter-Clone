import e from "express";
const router = e.Router();
import protectedRoutes from "../middleware/protectedRoutes.js";

import {
  deleteNotifications,
  getNotifications,
} from "../controllers/notification.controller.js";

router.get("/", protectedRoutes, getNotifications);
router.delete("/", protectedRoutes, deleteNotifications);

export default router;
