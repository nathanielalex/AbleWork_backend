import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  password: {
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

companySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//compare password
companySchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const Company = mongoose.model("Company", companySchema);

export default Company;
