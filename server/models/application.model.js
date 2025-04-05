import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  applicationDate: { type: Date, default: Date.now },
  status: { type: String, default: "Applied" },
  cv: { type: String, required: false },
});

const Application = mongoose.model("Application", applicationSchema);
export default Application;
