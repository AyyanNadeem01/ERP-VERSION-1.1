const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true },
  date: { type: Date, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  items: [
    {
      srNo: Number,
      description: String,
      rate: Number,
      quantity: Number,
      total: Number
    }
  ],
  totalAmount: Number,
  cost: { type: Number, default: 0 },
  profit: { type: Number, default: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // user-specific
});

module.exports = mongoose.model("Sale", saleSchema);
