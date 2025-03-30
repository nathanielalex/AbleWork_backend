import mongoose from "mongoose";

const userDetailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' 
  },
  skills: {
    type: [String], 
    required: true
  },
  CV: {
    type: String, //URL
    required: true
  }
});

const UserDetail = mongoose.model('UserDetail', userDetailSchema);

export default UserDetail;
