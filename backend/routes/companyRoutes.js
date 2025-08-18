const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const { 
  createCompany, 
  getMyCompany, 
  updateCompany, 
  deleteCompany 
} = require("../controllers/companyController");

// Create company
router.post("/", authenticateToken, createCompany);

// Get my company
router.get("/", authenticateToken, getMyCompany);

// Update company
router.put("/", authenticateToken, updateCompany);

// Delete company
router.delete("/", authenticateToken, deleteCompany);

module.exports = router;
