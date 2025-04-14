import mongoose from "mongoose";

// COMMENT: This schema defines the structure of the "job" collection in the database.
const jobSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  jobRequirements: {
    type: String,
    required: true,
  },
  salaryRange: {
    type: String,
    required: true,
  },
  jobLocation: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    required: true,
  },
  experienceLevel: {
    type: String,
    default: "Entry Level",
  },
  disabilitiesFriendly: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

//to set `updatedAt` to current time before saving
jobSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
