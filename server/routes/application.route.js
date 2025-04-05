import express from "express";
import {
  getApplicationsByUserId,
  getApplicationsByCompanyId,
  updateApplicationStatus,
  createApplication,
} from "../controllers/application.controller.js";

const router = express.Router();

router.get("/user/:userId", getApplicationsByUserId);
router.get("/company/:companyId", getApplicationsByCompanyId);
router.post("/:applicationId/status", updateApplicationStatus);
router.post("/", createApplication);

export default router;
