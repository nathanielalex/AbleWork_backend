import express from "express";
import {
  registerUser,
  loginUser,
  registerCompany,
  loginCompany,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/register-company", registerCompany);

router.post("/login-company", loginCompany);

export default router;
