const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemName: { type: String, required: true, trim: true },
  stock: { type: Number, required: true, default: 0 },
  costPrice: { type: Number, required: true, default: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // user-specific
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
