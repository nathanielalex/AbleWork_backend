import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  applicationDate: {
    type: Date,
    default: Date.now,
  },
  applicationStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    required: true,
  },
  resume: {
    type: String, // File path
    required: true,
  },
  coverLetter: {
    type: String, // File path
    required: true,
  },
});

const Application = mongoose.model("Application", applicationSchema);
export default Application;
