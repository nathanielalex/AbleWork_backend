import express from "express";
import {
  registerUser,
  loginUser,
  registerCompany,
  loginCompany,
  changePassword,
  changePasswordCompany,
} from "../controllers/auth.controller.js";

const router = express.Router();

// COMMENT: This router handles all the routes related to authentication.
router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/register-company", registerCompany);
router.post("/login-company", loginCompany);

router.put("/change-password/:id", changePassword);
router.put("/change-password-company/:id", changePasswordCompany);

export default router;
