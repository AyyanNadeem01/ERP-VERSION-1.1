const mongoose = require("mongoose");

const vendorLedgerSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  stockPurchased: { type: Number, default: 0 },
  paymentPaid: { type: Number, default: 0 },
  balance: { type: Number, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // user-specific
});

module.exports = mongoose.model("VendorLedger", vendorLedgerSchema);
