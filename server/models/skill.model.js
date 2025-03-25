import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
