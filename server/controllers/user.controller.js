import User from '../models/user.model.js';

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params; 
    const updatedData = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { 
        $set: updatedData, 
        $currentDate: { updatedAt: true }, 
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};