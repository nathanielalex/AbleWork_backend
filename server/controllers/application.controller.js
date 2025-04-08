import mongoose from "mongoose";
import Application from "../models/application.model.js";
import ApplicationStatus from "../models/applicationStatus.model.js";

// GET /applications/:applicationId
export const getApplicationById = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;

    const application = await Application.aggregate([
      {
        // Match the application by its ID
        $match: { _id: new mongoose.Types.ObjectId(applicationId) },
      },
      {
        // Join with the Users collection to get user details
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        // Unwind the user array to get a single object
        $unwind: "$user",
      },
      {
        // Join with the Jobs collection to get job details
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      {
        // Unwind the job array to get a single object
        $unwind: "$job",
      },
      {
        // Join with the Companies collection to get company details
        $lookup: {
          from: "companies",
          localField: "job.companyId",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        // Unwind the company array to get a single object
        $unwind: "$company",
      },
      {
        // Join with the ApplicationStatuses collection to get status history
        $lookup: {
          from: "applicationstatuses",
          localField: "_id",
          foreignField: "applicationId",
          as: "applicationStatuses",
        },
      },
      {
        // Sort the applicationStatuses by createdAt (optional)
        $addFields: {
          applicationStatuses: {
            $sortArray: {
              input: "$applicationStatuses",
              sortBy: { createdAt: 1 },
            },
          },
        },
      },
    ]);

    if (!application || application.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application[0]); // Return the first (and only) result
  } catch (err) {
    console.error("getApplicationById error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET /applications/user/:userId
export const getApplicationsByUserId = async (req, res) => {
  try {
    const applications = await Application.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(req.params.userId) },
      },
      // Join ke ApplicationStatuses
      {
        $lookup: {
          from: "applicationstatuses",
          localField: "_id",
          foreignField: "applicationId",
          as: "applicationStatuses",
        },
      },
      // Join ke Job
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },

      // Join ke Company via job.companyId
      {
        $lookup: {
          from: "companies",
          localField: "job.companyId",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },

      // Sort by application date
      {
        $sort: { applicationDate: -1 },
      },
    ]);

    res.json(applications);
  } catch (err) {
    console.error("getApplicationsByUserId error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET /applications/company/:companyId
export const getApplicationsByCompanyId = async (req, res) => {
  try {
    const companyId = req.params.companyId;

    const applications = await Application.aggregate([
      // Join ke Job
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },

      // Filter job dengan companyId yang sesuai
      {
        $match: { "job.companyId": new mongoose.Types.ObjectId(companyId) },
      },

      // Join ke ApplicationStatuses
      {
        $lookup: {
          from: "applicationstatuses",
          localField: "_id",
          foreignField: "applicationId",
          as: "applicationStatuses",
        },
      },

      // (Optional) Join company detail
      {
        $lookup: {
          from: "companies",
          localField: "job.companyId",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },

      // Sort
      {
        $sort: { applicationDate: -1 },
      },
    ]);

    res.json(applications);
  } catch (err) {
    console.error("getApplicationsByCompanyId error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET /applications/job/:jobId
export const getApplicationsByJobId = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const applications = await Application.aggregate([
      {
        // Join with ApplicationStatuses
        $lookup: {
          from: "applicationstatuses",
          localField: "_id",
          foreignField: "applicationId",
          as: "applicationStatuses",
        },
      },
      {
        // Join with Job to get job details
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      {
        // Unwind the job to get a clean object instead of an array
        $unwind: "$job",
      },
      {
        // Join with Users to get user details
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        // Unwind the user to get a clean object instead of an array
        $unwind: "$user",
      },
      {
        // Match applications related to the provided jobId
        $match: { jobId: new mongoose.Types.ObjectId(jobId) },
      },
      {
        // Sort by application date (optional, change according to need)
        $sort: { applicationDate: -1 },
      },
    ]);

    res.json(applications);
  } catch (err) {
    console.error("getApplicationsByJobId error:", err);
    res.status(500).json({ error: err.message });
  }
};

// POST /applications/:applicationId/status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { statusKey, statusLabel, notes } = req.body;
    const applicationId = req.params.applicationId;

    // Simpan ke ApplicationStatus
    const newStatus = new ApplicationStatus({
      applicationId,
      statusKey,
      statusLabel,
      createdAt: new Date(),
      notes,
    });

    await newStatus.save();

    // Update statusLabel terakhir ke table Application
    await Application.findByIdAndUpdate(applicationId, {
      status: statusLabel,
      updatedAt: new Date(),
    });

    res.status(201).json({ message: "Status updated", status: newStatus });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ error: err.message });
  }
};

// POST /applications
export const createApplication = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    const existingApplication = await Application.findOne({ userId, jobId });
    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "User has already applied to this job." });
    }

    const application = new Application({
      userId,
      jobId,
      applicationDate: new Date(),
      status: "Applied",
    });

    const savedApp = await application.save();

    const initialStatus = new ApplicationStatus({
      applicationId: savedApp._id,
      statusKey: "applied",
      statusLabel: "Applied",
      createdAt: new Date(),
      notes: "Initial application",
    });

    await initialStatus.save();

    res.status(201).json({
      message: "Application created",
      application: savedApp,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
};
