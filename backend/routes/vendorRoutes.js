const express = require("express");
const router = express.Router();
const {
  getVendors,
  addVendor,
  updateVendorBalance,
} = require("../controllers/vendorController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// /api/vendors/
router.get("/getvendors", authenticateToken,getVendors);
router.post("/addvendor", authenticateToken,addVendor);

// /api/vendors/:id/balance
router.put("/vendor/:id/balance", authenticateToken,updateVendorBalance);

module.exports = router;
