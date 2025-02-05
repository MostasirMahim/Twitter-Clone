import express from "express";
import protectedRoutes from './../middleware/protectedRoutes.js';
import { getChatPeople, getCoversation, getOthers, sendMessage } from './../controllers/message.controller.js';


const router = express.Router();

router.get("/getConversation/:id", protectedRoutes, getCoversation);
router.get("/getChatPeople", protectedRoutes, getChatPeople);
router.get("/getOthers", protectedRoutes, getOthers);
router.post("/sendMessage", protectedRoutes, sendMessage);

export default router;
