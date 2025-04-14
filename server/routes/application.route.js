import express from "express";
import {
  getApplicationById,
  getApplicationsByUserId,
  updateApplicationStatus,
  createApplication,
  getApplicationsByJobId,
  getApplicationsByCompanyId,
} from "../controllers/application.controller.js";

const router = express.Router();

// COMMENT: This router handles all the routes related to applications.
router.get("/:applicationId", getApplicationById);
router.get("/user/:userId", getApplicationsByUserId);
router.get("/job/:jobId", getApplicationsByJobId);
router.get("/company/:companyId", getApplicationsByCompanyId);

router.post("/:applicationId/status", updateApplicationStatus);
router.post("/", createApplication);

export default router;
