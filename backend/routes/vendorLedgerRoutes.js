// routes/vendorLedgerRoutes.js
const express = require("express");
const router = express.Router();
const {
  addLedgerEntry,
  getVendorLedger,
  getAllVendorLedgers,
} = require("../controllers/vendorLedgerController");
const { authenticateToken } = require("../middlewares/authMiddleware");
// POST /api/vendorledger/add
router.post("/add", authenticateToken,addLedgerEntry);

// GET /api/vendorledger/:vendorId
router.get("/:vendorId", authenticateToken,getVendorLedger);

// GET /api/vendorledger?vendor=<ID>&fromDate=<YYYY-MM-DD>&toDate=<YYYY-MM-DD>
router.get("/", authenticateToken,getAllVendorLedgers);

module.exports = router;
