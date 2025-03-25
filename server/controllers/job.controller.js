import mongoose from "mongoose";
import Job from "../models/job.model.js";

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error in fetching jobs: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCurrentJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true });
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error in fetching jobs: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    console.error("Error in fetching job by ID: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createJob = async (req, res) => {
  const job = req.body;

  if (
    !job.jobTitle ||
    !job.jobLocation ||
    !job.salaryRange ||
    !job.jobDescription ||
    !job.jobRequirements ||
    !job.jobTypeId ||
    !job.disabilitiesFriendly ||
    !job.companyId
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required fields" });
  }

  const newJob = new Job(job);

  try {
    await newJob.save();
    res.status(201).json({ success: true, data: newJob });
  } catch (error) {
    console.error("Error in creating job: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateJob = async (req, res) => {
  const { id } = req.params;
  const job = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Job not found" });
  }

  try {
    const updatedJob = await Job.findByIdAndUpdate(id, job, { new: true });
    res.status(200).json({ success: true, data: updatedJob });
  } catch (error) {
    console.error("Error in updating job: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Job not found" });
  }

  try {
    await Job.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Job deleted" });
  } catch (error) {
    console.error("Error in deleting job: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
