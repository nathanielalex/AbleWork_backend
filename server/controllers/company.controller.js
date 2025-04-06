import Company from "../models/company.model.js";

export const updateCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const updatedData = req.body;

    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      {
        $set: updatedData,
        $currentDate: { updatedAt: true },
      },
      { new: true }
    );

    if (!updatedCompany) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Company updated successfully.",
      updatedCompany,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCompanyByID = async (req, res) => {
  try {
    const { companyId } = req.params;
    const company = await Company.findById(companyId).select("-password");
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const company = await Company.findByIdAndDelete(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
