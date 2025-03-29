import express from "express";
import {
  getJobs,
  deleteJob,
  updateJob,
  createJob,
  getJobById,
  getJobsWithCompany,
  getJobByIdWithCompany,
  getJobsByCompany
} from "../controllers/job.controller.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.get("/", getJobs);

router.get("/companies", getJobsWithCompany);
router.get("/company/:id", getJobsByCompany);

// router.get("/current", getCurrentJobs);

router.get("/:id", getJobById);
router.get("/companies/:id", getJobByIdWithCompany);

router.post("/", createJob);

// router.post("/", protect, (req, res) => {
//   createJob(req, res);
// });

router.delete("/:id", deleteJob);

router.put("/:id", updateJob);

export default router;
