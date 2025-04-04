import mongoose from "mongoose";
import SaveJob from "../models/saveJob.model.js";

export const saveJob = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    // Cek apakah userId dan jobId sudah ada di database
    const existingSave = await SaveJob.findOne({ userId, jobId });
    if (existingSave) {
      return res.status(400).json({
        success: false,
        message: "User already saved this job.",
      });
    }

    // Jika belum ada, buat entry baru
    const newSave = new SaveJob({ userId, jobId, savedAt: new Date() });
    await newSave.save();

    res.status(201).json({ success: true, data: newSave });
  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSaveJobs = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "userId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId format" });
    }

    const saveJobs = await SaveJob.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      {
        $lookup: {
          from: "companies",
          localField: "job.companyId",
          foreignField: "_id",
          as: "job.companyDetails",
        },
      },
      { $unwind: "$job.companyDetails" },
      {
        $project: {
          _id: 1,
          job: 1,
          savedAt: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: saveJobs });
  } catch (error) {
    console.error("Error fetching saved jobs:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteSaveJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid job ID" });
    }

    await SaveJob.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Saved job deleted" });
  } catch (error) {
    console.error("Error deleting saved job: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
