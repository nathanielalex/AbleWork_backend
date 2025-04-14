import mongoose from "mongoose";

// COMMENT: This schema defines the structure of the "applicationStatus" collection in the database.
const applicationStatusSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true,
  },
  statusKey: {
    type: String,
    required: true,
    enum: [
      "applied",
      "screening_call",
      "first_interview",
      "technical_interview",
      "final_interview",
      "accepted",
      "rejected",
    ],
  },
  statusLabel: {
    type: String,
    required: true,
    enum: [
      "Applied",
      "Screening Call",
      "First Interview",
      "Technical Interview",
      "Final Interview",
      "Accepted",
      "Rejected",
    ],
  },
  notes: {
    type: String,
    default: "",
  },
  createdAt: { type: Date, default: Date.now },
});

const ApplicationStatus = mongoose.model(
  "ApplicationStatus",
  applicationStatusSchema
);
export default ApplicationStatus;
