import mongoose from "mongoose";

const userSkillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
    required: true,
  },
});

const UserSkill = mongoose.model("UserSkill", userSkillSchema);

export default UserSkill;
