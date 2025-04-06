import express from "express";
import {
  deleteCompany,
  getCompanyByID,
  updateCompany,
} from "../controllers/company.controller.js";

const router = express.Router();

router.put("/:companyId", updateCompany);
router.get("/:companyId", getCompanyByID);
router.delete("/:companyId", deleteCompany);

export default router;
