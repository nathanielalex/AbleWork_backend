import express from "express";
import { getUserDetails, updateUserDetails } from "../controllers/userDetail.controller.js";

const router = express.Router();

router.get("/:userId", getUserDetails);
router.put("/:userId", updateUserDetails);

export default router;