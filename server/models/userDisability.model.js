import mongoose from "mongoose";

const userDisabilitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  disabilitiesTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DisabilitiesType",
    required: true,
  },
});

const UserDisability = mongoose.model("UserDisability", userDisabilitySchema);

export default UserDisability;
