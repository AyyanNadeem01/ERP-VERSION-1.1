const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  balance: { type: Number, default: 0 },
  remarks: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // user-specific
});

module.exports = mongoose.model("Client", clientSchema);
