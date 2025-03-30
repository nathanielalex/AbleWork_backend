import express from "express";
import { updateUser, getUserByID } from "../controllers/user.controller.js";

const router = express.Router();

router.put("/:userId", updateUser);
router.get("/:userId", getUserByID);

export default router;