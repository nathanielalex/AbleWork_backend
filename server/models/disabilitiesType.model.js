import mongoose from "mongoose";

const disabilitiesTypeSchema = new mongoose.Schema({
  disabilitiesTypeName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const DisabilitiesType = mongoose.model(
  "DisabilitiesType",
  disabilitiesTypeSchema
);

export default DisabilitiesType;
