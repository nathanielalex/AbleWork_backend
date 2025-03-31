import express from "express";
import {
  registerUser,
  loginUser,
  registerCompany,
  loginCompany,
  changePassword
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/register-company", registerCompany);

router.post("/login-company", loginCompany);

router.put("/change-password/:id", changePassword);

export default router;
