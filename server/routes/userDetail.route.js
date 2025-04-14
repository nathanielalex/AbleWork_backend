import express from "express";
import {
  getUserDetails,
  updateUserDetails,
} from "../controllers/userDetail.controller.js";

const router = express.Router();

// COMMENT: This router handles all the routes related to user details.
router.get("/:userId", getUserDetails);
router.put("/:userId", updateUserDetails);

export default router;
