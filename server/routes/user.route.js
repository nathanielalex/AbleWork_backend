import express from "express";
import { updateUser, getUserDetails } from "../controllers/user.controller.js";

const router = express.Router();

router.put("/:userId", updateUser);
router.get("/:userId", getUserDetails);

export default router;