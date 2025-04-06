import mongoose from "mongoose";

const SaveJobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  savedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SaveJob = mongoose.model("SaveJob", SaveJobSchema);

export default SaveJob;
