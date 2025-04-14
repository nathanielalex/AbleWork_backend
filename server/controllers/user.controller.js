import User from "../models/user.model.js";
import UserPreference, {
  VALID_JOB_TYPES,
  VALID_EXPERIENCE_LEVELS,
  VALID_INDUSTRIES,
} from "../models/userPreference.model.js";
import { isValidArrayValues } from "../utils/utils.js";

// COMMENT: This file handles user-related operations such as creating, updating, and deleting users and their preferences.

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
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserByID = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createUserPreference = async (req, res) => {
  try {
    const {
      userId,
      jobType,
      experienceLevel,
      salaryRange,
      preferredLocation,
      relocation,
      preferredIndustry,
    } = req.body;

    if (!isValidArrayValues(jobType, VALID_JOB_TYPES)) {
      return res.status(400).json({ error: "Invalid jobType values" });
    }

    if (!isValidArrayValues(experienceLevel, VALID_EXPERIENCE_LEVELS)) {
      return res.status(400).json({ error: "Invalid experienceLevel values" });
    }

    if (!isValidArrayValues(preferredIndustry, VALID_INDUSTRIES)) {
      return res
        .status(400)
        .json({ error: "Invalid preferredIndustry values" });
    }

    const existing = await UserPreference.findOne({ userId });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Preference already exists. Use update instead." });
    }

    const preference = new UserPreference({
      userId,
      jobType,
      experienceLevel,
      salaryRange,
      preferredLocation,
      relocation,
      preferredIndustry,
    });

    await preference.save();
    res.status(201).json(preference);
  } catch (err) {
    console.error("createUserPreference error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateUserPreference = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      jobType,
      experienceLevel,
      salaryRange,
      preferredLocation,
      relocation,
      preferredIndustry,
    } = req.body;

    if (jobType && !isValidArrayValues(jobType, VALID_JOB_TYPES)) {
      return res.status(400).json({ error: "Invalid jobType values" });
    }

    if (
      experienceLevel &&
      !isValidArrayValues(experienceLevel, VALID_EXPERIENCE_LEVELS)
    ) {
      return res.status(400).json({ error: "Invalid experienceLevel values" });
    }

    if (
      preferredIndustry &&
      !isValidArrayValues(preferredIndustry, VALID_INDUSTRIES)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid preferredIndustry values" });
    }

    const updates = {
      jobType,
      experienceLevel,
      salaryRange,
      preferredLocation,
      relocation,
      preferredIndustry,
    };

    const updated = await UserPreference.findOneAndUpdate({ userId }, updates, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Preferences not found." });
    }

    res.json(updated);
  } catch (err) {
    console.error("updateUserPreference error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getUserPreferenceByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const preference = await UserPreference.findOne({ userId });
    if (!preference) {
      return res.status(404).json({ message: "Preferences not found." });
    }
    res.json(preference);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const checkUserPreferenceExists = async (req, res) => {
  try {
    const { userId } = req.params;
    const preference = await UserPreference.findOne({ userId });
    res.status(200).json({ data: preference });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
