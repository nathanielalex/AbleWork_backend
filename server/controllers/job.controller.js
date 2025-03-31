import mongoose from "mongoose";
import Job from "../models/job.model.js";
import UserDetail from "../models/userDetail.model.js";
import axios from "axios";

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
          as: "companyDetails"
        }
      },
      {
        $unwind: "$companyDetails"
      },
      {
        $project: {
          "companyDetails.password": 0  //exclude password
        }
      }
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
        $match: { _id: jobId }
      },
      {
        $lookup: {
          from: "companies",
          localField: "companyId",
          foreignField: "_id",
          as: "companyDetails"
        }
      },
      {
        $unwind: "$companyDetails"
      },
      {
        $project: {
          "companyDetails.password": 0
        }
      }
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
          companyId: mongoId
        }
      },
      {
        $lookup: {
          from: "companies",
          localField: "companyId",
          foreignField: "_id",
          as: "companyDetails"
        }
      },
      {
        $unwind: "$companyDetails"
      },
      {
        $project: {
          "companyDetails.password": 0  // Exclude password
        }
      }
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

const getAllJobRequirements = async () => {
  try {
    const jobs = await Job.find({}).select('jobRequirements');
    const jobRequirements = jobs.map(job => job.jobRequirements).flat();
    return jobRequirements; // Return the data instead of sending a response
  } catch (error) {
    console.error("Error in fetching jobs: ", error.message);
    throw new Error("Server error");
  }
};

//blm testing
const getUserSkills = async (userId) => {
  try {
    const user = await UserDetail.findOne({ userId: userId }).select('skills');
    if (!user) {
      throw new Error('User not found');
    }
    const skillsString = user.skills.join(', ');
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
    const response = await axios.post('http://localhost:5000/recommend_jobs', {
      user_skills: userSkills,
      job_openings: jobRequirements
    });

    console.log('Response from recommendation API:', response.data);

    res.status(200).json({
      success: true,
      recommendationResult: response.data,
    });
  } catch (error) {
    console.error('Error sending recommendation request:', error);
    res.status(500).json({
      success: false,
      message: 'Error communicating with recommendation service',
    });
  }
};
