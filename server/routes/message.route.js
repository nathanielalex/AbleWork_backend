import express from "express";
import {
  searchUsersAndCompanies,
  sendMessage,
  getConversation,
  getMessageParticipants,
} from "../controllers/message.controller.js";

const router = express.Router();

// COMMENT: This router handles all the routes related to messages.
router.get("/search", searchUsersAndCompanies);
router.post("/send", sendMessage);

router.get("/conversation/:userId1/:userId2", getConversation);
router.get("/participants/:currentId", getMessageParticipants);

export default router;
