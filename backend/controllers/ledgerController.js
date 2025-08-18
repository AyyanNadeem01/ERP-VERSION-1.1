const Ledger = require("../models/Ledger");
const Client = require("../models/Client");

// Add a ledger entry
exports.addLedgerEntry = async (req, res) => {
  try {
    const { clientId, description, debit, credit } = req.body;

    // Get client and check ownership
    const client = await Client.findOne({ _id: clientId, owner: req.user._id });
    if (!client) {
      return res.status(404).json({ message: "Client not found or not authorized" });
    }

    // Calculate new balance
    const newBalance = client.balance + (debit - credit);

    // Update client's balance
    client.balance = newBalance;
    await client.save();

    // Create ledger entry with owner
    const newEntry = new Ledger({
      client: clientId,
      description,
      debit,
      credit,
      balanceAfter: newBalance,
      owner: req.user._id, // assign owner
    });

    await newEntry.save();

    res.status(201).json(newEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add ledger entry" });
  }
};

// Get ledger entries for a client (user-specific)
exports.getClientLedger = async (req, res) => {
  try {
    const { clientId } = req.params;

    // Check ownership of client
    const client = await Client.findOne({ _id: clientId, owner: req.user._id });
    if (!client) {
      return res.status(404).json({ message: "Client not found or not authorized" });
    }

    const entries = await Ledger.find({ client: clientId, owner: req.user._id })
      .populate("client", "name address")
      .sort({ date: 1 });

    res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch ledger entries" });
  }
};

// Get all ledger entries for the logged-in user
exports.getAllLedgers = async (req, res) => {
  try {
    const entries = await Ledger.find({ owner: req.user._id })
      .populate("client", "name address")
      .sort({ date: 1 });

    res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch ledgers" });
  }
};
