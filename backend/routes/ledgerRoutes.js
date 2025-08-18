const express = require("express");
const router = express.Router();
const ledgerController = require("../controllers/ledgerController");
const { authenticateToken } = require("../middlewares/authMiddleware");
// POST: Add ledger entry
router.post("/addledger", authenticateToken,ledgerController.addLedgerEntry);

// GET: Get ledger by client ID
router.get("/client/:clientId", authenticateToken,ledgerController.getClientLedger);

// GET: Get all ledger entries (optional)
router.get("/getallledgers",authenticateToken, ledgerController.getAllLedgers);

module.exports = router;
