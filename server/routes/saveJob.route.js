import express from "express";
import {
  deleteSaveJob,
  getSaveJobs,
  saveJob,
} from "../controllers/saveJob.controller.js";

const router = express.Router();

// COMMENT: This router handles all the routes related to saved jobs.
router.post("/", saveJob);
router.get("/", getSaveJobs);
router.delete("/:id", deleteSaveJob);

export default router;
