const Sale = require("../models/Sale");
const Client = require("../models/Client");
const Ledger = require("../models/Ledger");

// Get a specific sale by ID (user-specific)
exports.getSaleById = async (req, res) => {
  try {
    const saleId = req.params.id;
    const sale = await Sale.findOne({ _id: saleId, owner: req.user._id })
      .populate("client", "name address balance");

    if (!sale) {
      return res.status(404).json({ message: "Sale not found or not authorized" });
    }

    res.status(200).json(sale);
  } catch (err) {
    console.error("Error fetching sale:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a sale for an existing client (user-specific)
exports.addSale = async (req, res) => {
  try {
    const { invoiceNumber, clientId, items, totalAmount, cost, date } = req.body;

    const client = await Client.findOne({ _id: clientId, owner: req.user._id });
    if (!client) {
      return res.status(404).json({ message: "Client not found or not authorized" });
    }

    const profit = totalAmount - cost;

    const sale = new Sale({
      invoiceNumber,
      date: new Date(date),
      client: clientId,
      items,
      totalAmount,
      cost,
      profit,
      owner: req.user._id
    });
    await sale.save();

    // Update client balance
    client.balance += totalAmount;
    await client.save();

    // Create Ledger entry
    const ledgerEntry = new Ledger({
      client: clientId,
      date: new Date(date),
      description: `Sale Invoice: ${invoiceNumber}`,
      debit: totalAmount,
      credit: 0,
      balanceAfter: client.balance,
      owner: req.user._id
    });
    await ledgerEntry.save();

    res.status(201).json({ message: "Sale added successfully", sale });
  } catch (err) {
    console.error("Error adding sale:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all sales (user-specific)
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find({ owner: req.user._id })
      .populate("client", "name address balance")
      .sort({ date: -1 });

    res.status(200).json(sales);
  } catch (err) {
    console.error("Error fetching sales:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a sale (user-specific)
exports.deleteSale = async (req, res) => {
  try {
    const saleId = req.params.id;

    const sale = await Sale.findOne({ _id: saleId, owner: req.user._id });
    if (!sale) {
      return res.status(404).json({ message: "Sale not found or not authorized" });
    }

    const client = await Client.findOne({ _id: sale.client, owner: req.user._id });
    if (client) {
      client.balance -= sale.totalAmount;
      await client.save();

      // Add Ledger Entry for Sale Deletion
      const ledgerEntry = new Ledger({
        client: client._id,
        date: new Date(),
        description: `Reversal of Sale Invoice ${sale.invoiceNumber}`,
        debit: 0,
        credit: sale.totalAmount,
        balanceAfter: client.balance,
        owner: req.user._id
      });
      await ledgerEntry.save();
    }

    await Sale.findByIdAndDelete(saleId);

    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (err) {
    console.error("Error deleting sale:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update cost of a sale (user-specific)
exports.updateSaleCost = async (req, res) => {
  try {
    const saleId = req.params.id;
    const { cost } = req.body;

    const sale = await Sale.findOne({ _id: saleId, owner: req.user._id });
    if (!sale) return res.status(404).json({ message: "Sale not found or not authorized" });

    // Update cost and recalculate profit
    sale.cost = cost;
    sale.profit = sale.totalAmount - cost;
    await sale.save();

    res.status(200).json({ message: "Cost updated successfully", sale });
  } catch (err) {
    console.error("Error updating sale cost:", err);
    res.status(500).json({ message: "Server error" });
  }
};
