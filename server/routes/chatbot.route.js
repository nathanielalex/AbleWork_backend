import express from "express";
import { handleChatbotMessage } from "../controllers/chatbot.controller.js";

const router = express.Router();

// COMMENT: This router handles all the routes related to the chatbot.
router.post("/", handleChatbotMessage);

export default router;
