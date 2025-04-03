import express from "express";
import {
  deleteSaveJob,
  getSaveJobs,
  saveJob,
} from "../controllers/saveJob.controller.js";

const router = express.Router();

router.post("/", saveJob);
router.get("/", getSaveJobs);
router.delete("/:id", deleteSaveJob);

export default router;
