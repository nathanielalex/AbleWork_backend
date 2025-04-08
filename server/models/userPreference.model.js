// models/UserPreference.ts
import mongoose from "mongoose";

const VALID_JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
  "Remote",
];

const VALID_EXPERIENCE_LEVELS = [
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Manager",
  "Director",
  "Executive",
];

const VALID_INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
];

const UserPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    jobType: [{ type: String, enum: VALID_JOB_TYPES }],
    experienceLevel: [{ type: String, enum: VALID_EXPERIENCE_LEVELS }],
    salaryRange: { type: String },
    preferredLocation: { type: String },
    relocation: { type: Boolean },
    preferredIndustry: [{ type: String, enum: VALID_INDUSTRIES }],
  },
  {
    timestamps: true,
  }
);

const UserPreference = mongoose.model("UserPreference", UserPreferenceSchema);
export default UserPreference;
export { VALID_JOB_TYPES, VALID_EXPERIENCE_LEVELS, VALID_INDUSTRIES };
