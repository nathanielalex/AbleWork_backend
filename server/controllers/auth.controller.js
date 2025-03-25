import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import Company from "../models/company.model.js";

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
      role,
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      dateOfBirth,
      gender,
      address,
      profilePicture,
      role,
    });

    await newUser.save();

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
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCompany = new Company({
      companyName,
      companyAddress,
      companyPhone,
      companyEmail,
      industryType,
      companyWebsite,
      password: hashedPassword,
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
    const company = await Company.findOne({ email });
    if (!company)
      return res.status(400).json({ message: "Invalid credentials" });

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
