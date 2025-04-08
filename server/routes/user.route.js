import express from "express";
import {
  updateUser,
  getUserByID,
  deleteUser,
  createUserPreference,
  updateUserPreference,
  getUserPreferenceByUserId,
  checkUserPreferenceExists,
} from "../controllers/user.controller.js";

const router = express.Router();

router.put("/:userId", updateUser);
router.get("/:userId", getUserByID);
router.delete("/:userId", deleteUser);

router.post("/preference/", createUserPreference);
router.put("/preference/:userId", updateUserPreference);
router.get("/preference/:userId", getUserPreferenceByUserId);
router.get("/preference/exists/:userId", checkUserPreferenceExists);

export default router;
