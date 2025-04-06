import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import Company from "../models/company.model.js";
import bcrypt from "bcryptjs";
import UserDetail from "../models/userDetail.model.js";

export const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      dateOfBirth,
      gender,
      address,
      profilePicture,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !password ||
      !dateOfBirth ||
      !gender ||
      !address
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      dateOfBirth,
      gender,
      address,
      profilePicture,
      role: "user",
    });

    await newUser.save();

    const userDetail = new UserDetail({
      userId: newUser._id,
      skills: [],
      CV: "CV not provided",
    });

    await userDetail.save();

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        dateOfBirth: newUser.dateOfBirth,
        gender: newUser.gender,
        address: newUser.address,
        profilePicture: newUser.profilePicture,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const registerCompany = async (req, res) => {
  try {
    const {
      companyName,
      companyAddress,
      companyPhone,
      companyEmail,
      industryType,
      companyWebsite,
      password,
      companyPicture,
    } = req.body;

    if (
      !companyName ||
      !companyAddress ||
      !companyPhone ||
      !companyEmail ||
      !industryType
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    const existingCompany = await Company.findOne({ companyEmail });
    if (existingCompany) {
      return res
        .status(400)
        .json({ message: "Company with this email already exists." });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    const newCompany = new Company({
      companyName,
      companyAddress,
      companyPhone,
      companyEmail,
      industryType,
      companyWebsite,
      password,
      companyPicture,
    });

    await newCompany.save();

    res.status(201).json({
      message: "Company registered successfully.",
      company: {
        companyName: newCompany.companyName,
        companyAddress: newCompany.companyAddress,
        companyPhone: newCompany.companyPhone,
        companyEmail: newCompany.companyEmail,
        industryType: newCompany.industryType,
        companyWebsite: newCompany.companyWebsite,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  try {
    const company = await Company.findOne({ companyEmail: email });
    if (!company) return res.status(400).json({ message: "wrong credentials" });

    const isMatch = await company.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ companyId: company._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword; //will automatically hash

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const changePasswordCompany = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { id } = req.params;

  try {
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const isMatch = await company.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    company.password = newPassword; //will automatically hash

    await company.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
