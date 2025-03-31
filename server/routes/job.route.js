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
  getJobsById
} from "../controllers/job.controller.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.get("/", getJobs);
router.get("/recommended-jobs/:id", getRecommendedJobs);
// router.get("/job-requirements", getAllJobRequirements);

router.get("/companies", getJobsWithCompany);
router.get("/company/:id", getJobsByCompany);

// router.get("/current", getCurrentJobs);

router.get("/:id", getJobById);
router.post("/multiple", getJobsById);
router.get("/companies/:id", getJobByIdWithCompany);

router.post("/", createJob);

// router.post("/", protect, (req, res) => {
//   createJob(req, res);
// });

router.delete("/:id", deleteJob);

router.put("/:id", updateJob);

export default router;
