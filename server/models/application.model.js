import mongoose from "mongoose";

// COMMENT: This schema defines the structure of the "application" collection in the database.
const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  applicationDate: { type: Date, default: Date.now },
  status: { type: String, default: "Applied" },
  cv: { type: String, required: false },
  updatedAt: { type: Date, default: Date.now },
});

const Application = mongoose.model("Application", applicationSchema);
export default Application;
