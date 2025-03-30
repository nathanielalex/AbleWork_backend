import UserDetail from '../models/userDetail.model.js';
import mongoose from "mongoose";

export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params; 

    const userDetail = await UserDetail.findOne({ userId: userId }).populate('userId'); 

    if (!userDetail) {
      return res.status(404).json({ message: 'User detail not found' });
    }

    return res.status(200).json(userDetail);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserDetails = async (req, res) => {
  const { userId } = req.params;
  const { skills, CV } = req.body;

  try {
    const userDetail = await UserDetail.findOne({ userId });

    if (!userDetail) {
      return res.status(404).json({ message: 'User details not found.' });
    }

    if (skills) userDetail.skills = skills;
    if (CV) userDetail.CV = CV;

    await userDetail.save();

    return res.status(200).json({ message: 'User details updated successfully', userDetail });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};