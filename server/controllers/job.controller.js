import mongoose from "mongoose";
import Job from "../models/job.model.js";
import UserDetail from "../models/userDetail.model.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error in fetching jobs: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getJobsWithCompany = async (req, res) => {
  try {
    const jobsWithCompanies = await Job.aggregate([
      {
        $lookup: {
          from: "companies",
          localField: "companyId",
          foreignField: "_id",
          as: "companyDetails",
        },
      },
      {
        $unwind: "$companyDetails",
      },
      {
        $project: {
          "companyDetails.password": 0, //exclude password
        },
      },
    ]);
    res.json(jobsWithCompanies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getJobByIdWithCompany = async (req, res) => {
  try {
    const id = req.params.id;
    const jobId = new mongoose.Types.ObjectId(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid job ID format" });
    }
    const jobWithCompany = await Job.aggregate([
      {
        $match: { _id: jobId },
      },
      {
        $lookup: {
          from: "companies",
          localField: "companyId",
          foreignField: "_id",
          as: "companyDetails",
        },
      },
      {
        $unwind: "$companyDetails",
      },
      {
        $project: {
          "companyDetails.password": 0,
        },
      },
    ]);

    if (jobWithCompany.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(jobWithCompany[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getJobsByCompany = async (req, res) => {
  try {
    // const id = req.params.id; // Get the jobId from request parameters
    // console.log(jobId)
    const companyId = req.params.id; //as url parameter
    const mongoId = new mongoose.Types.ObjectId(companyId);

    const jobsWithCompanies = await Job.aggregate([
      {
        $match: {
          companyId: mongoId,
        },
      },
      {
        $lookup: {
          from: "companies",
          localField: "companyId",
          foreignField: "_id",
          as: "companyDetails",
        },
      },
      {
        $unwind: "$companyDetails",
      },
      {
        $project: {
          "companyDetails.password": 0, // Exclude password
        },
      },
    ]);

    res.json(jobsWithCompanies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// export const getCurrentJobs = async (req, res) => {
//   try {
//     const jobs = await Job.find({ isActive: true });
//     res.status(200).json({ success: true, data: jobs });
//   } catch (error) {
//     console.error("Error in fetching jobs: ", error.message);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

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
    !job.jobType ||
    !job.experienceLevel ||
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

export const duplicateJob = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Job not found" });
  }

  try {
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const duplicatedJob = new Job({
      ...job.toObject(),
      _id: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Simpan job yang diduplikasi
    await duplicatedJob.save();

    res.status(201).json({ success: true, data: duplicatedJob });
  } catch (error) {
    console.error("Error in duplicating job: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getJobsWithApplicants = async (req, res) => {
  try {
    const companyId = req.params.companyId;

    const jobsWithApplicants = await Job.aggregate([
      {
        // Match jobs by companyId
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
        },
      },
      {
        // Join with Applications collection to find jobs that have applicants
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "jobId",
          as: "applications",
        },
      },
      // {
      //   // Filter jobs that have at least one applicant (applications array is not empty)
      //   $match: {
      //     "applications.0": { $exists: true },
      //   },
      // },
      {
        // Join with Companies to get company details for each job
        $lookup: {
          from: "companies",
          localField: "companyId",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        // Unwind the company array to make it an object
        $unwind: "$company",
      },
      {
        // Optionally, sort the jobs by application date (descending)
        $sort: { "applications.applicationDate": -1 },
      },
    ]);

    res.json(jobsWithApplicants);
  } catch (err) {
    console.error("getJobsWithApplicants error:", err);
    res.status(500).json({ error: err.message });
  }
};

const getAllJobRequirements = async () => {
  try {
    const jobs = await Job.find({}).select("_id jobRequirements");
    const jobDetails = jobs.map((job) => ({
      job_id: job._id,
      requirement: job.jobRequirements,
    }));
    return jobDetails;
  } catch (error) {
    console.error("Error in fetching jobs: ", error.message);
    throw new Error("Server error");
  }
};

const getUserSkills = async (userId) => {
  try {
    const user = await UserDetail.findOne({ userId: userId }).select("skills");
    if (!user) {
      throw new Error("User not found");
    }
    const skillsString = user.skills.join(", ");
    return skillsString;
  } catch (error) {
    console.error("Error in fetching user skills: ", error.message);
    throw new Error("Server error");
  }
};

export const getRecommendedJobs = async (req, res) => {
  const { id } = req.params;

  const jobRequirements = await getAllJobRequirements();
  const userSkills = await getUserSkills(id);
  try {
    console.log(`${process.env.AI_API}recommend_jobs`)
    const response = await axios.post(`${process.env.AI_API}recommend_jobs`, {
      user_skills: userSkills,
      job_openings: jobRequirements,
    });

    // console.log("Response from recommendation API:", response.data);
    const recommendedJobs  = response.data.recommended_jobs;

    if (!Array.isArray(recommendedJobs) || recommendedJobs.length === 0) {
      return res.status(400).json({ error: "no recommended jobs" });
    }

    const validJobMap = recommendedJobs.reduce((acc, job) => {
      if (mongoose.Types.ObjectId.isValid(job.job_id)) {
        acc[job.job_id] = { requirement: job.requirement, similarity: job.similarity };
      }
      return acc;
    }, {});

    const validObjectIds = Object.keys(validJobMap).map(id => new mongoose.Types.ObjectId(id));

    if (validObjectIds.length === 0) {
      return res.status(400).json({ error: "No valid job_ids provided" });
    }

    const jobsWithCompanies = await Job.aggregate([
      {
        $match: { _id: { $in: validObjectIds } },
      },
      {
        $lookup: {
          from: "companies",
          localField: "companyId",
          foreignField: "_id",
          as: "companyDetails",
        },
      },
      {
        $unwind: "$companyDetails",
      },
      {
        $project: {
          "companyDetails.password": 0,
        },
      },
    ]);

    if (jobsWithCompanies.length === 0) {
      return res.status(404).json({ error: "No jobs found for the provided IDs" });
    }

    const jobsWithSimilarity = jobsWithCompanies.map(job => {
      const jobData = validJobMap[job._id.toString()];
      return {
        ...job,
        similarity: jobData.similarity,
      };
    });
    
    res.json(jobsWithSimilarity);

    // res.status(200).json({
    //   success: true,
    //   recommendationResult: response.data,
    // });
  } catch (error) {
    console.error("Error sending recommendation request:", error);
    res.status(500).json({
      success: false,
      message: "Error communicating with recommendation service",
    });
  }
};

export const getJobsById = async (req, res) => {
  try {
    //list of ids
    const jobIds = req.body.jobIds;

    if (!Array.isArray(jobIds) || jobIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid list of jobIds.",
      });
    }

    const jobs = await Job.find({ _id: { $in: jobIds } });

    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No jobs found for the given jobIds.",
      });
    }

    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error in fetching jobs: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
