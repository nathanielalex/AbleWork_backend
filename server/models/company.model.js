import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  companyAddress: {
    type: String,
    required: true,
  },
  companyPhone: {
    type: String,
    required: true,
  },
  companyEmail: {
    type: String,
    required: true,
  },
  industryType: {
    type: String,
    required: true,
  },
  companyWebsite: {
    type: String,
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

companySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Company = mongoose.model("Company", companySchema);

export default Company;
