import express from "express";
import {
  getJobs,
  deleteJob,
  updateJob,
  createJob,
  getJobById,
  getJobsWithCompany,
  getJobByIdWithCompany,
  getJobsByCompany,
  getRecommendedJobs,
  getJobsById,
  duplicateJob,
  getJobsWithApplicants,
} from "../controllers/job.controller.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

// COMMENT: This router handles all the routes related to jobs.
router.get("/", getJobs);
router.get("/recommended-jobs/:id", getRecommendedJobs);

router.get("/companies", getJobsWithCompany);
router.get("/company/:id", getJobsByCompany);

router.get("/:id", getJobById);
router.post("/multiple", getJobsById);
router.get("/companies/:id", getJobByIdWithCompany);
router.get("/with-applicants/:companyId", getJobsWithApplicants);

router.post("/", createJob);
router.delete("/:id", deleteJob);
router.put("/:id", updateJob);
router.post("/duplicate/:id", duplicateJob);

// router.post("/", protect, (req, res) => {
//   createJob(req, res);
// });

export default router;
