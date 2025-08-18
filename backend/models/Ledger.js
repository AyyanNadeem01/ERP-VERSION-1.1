const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  debit: { type: Number, default: 0 },
  credit: { type: Number, default: 0 },
  balanceAfter: { type: Number, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // user-specific
});

module.exports = mongoose.model("Ledger", ledgerSchema);
