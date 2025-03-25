import mongoose from "mongoose";

const jobTypeSchema = new mongoose.Schema({
  jobTypeName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const JobType = mongoose.model("JobType", jobTypeSchema);

export default JobType;
