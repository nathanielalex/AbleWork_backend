import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, 
  },
  postedAt: {
    type: Date,
    required: true, 
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true, 
  },
  description: {
    type: String,
    required: true, 
  },
  requiredSkills: {
    type: [String],
    required: true, 
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
