import express from "express";
import {
  updateUser,
  getUserByID,
  deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.put("/:userId", updateUser);
router.get("/:userId", getUserByID);
router.delete("/:userId", deleteUser);

export default router;
