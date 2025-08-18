const express = require("express");
const router = express.Router();
const {
  generateInvoice,
  generateInvoiceImage,
} = require("../controllers/invoiceController");

// POST: /api/invoice/
router.post("/geninv", generateInvoice);

// GET: /api/invoice/:id
router.get("/invimg/:id", generateInvoiceImage);

module.exports = router;
