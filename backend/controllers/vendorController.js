const Vendor = require("../models/Vendor");
const VendorLedger = require("../models/VendorLedger");

// Get all vendors (user-specific)
exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ owner: req.user._id });
    res.status(200).json(vendors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch vendors" });
  }
};

// Add a new vendor (user-specific)
exports.addVendor = async (req, res) => {
  try {
    const vendor = new Vendor({
      ...req.body,
      owner: req.user._id
    });
    await vendor.save();
    res.status(201).json(vendor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add vendor" });
  }
};

// Update vendor balance and create ledger entry (user-specific)
exports.updateVendorBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description } = req.body;

    const vendor = await Vendor.findOne({ _id: id, owner: req.user._id });
    if (!vendor) return res.status(404).json({ message: "Vendor not found or not authorized" });

    // Update vendor balance
    vendor.balance += amount;
    await vendor.save();

    // Create vendor ledger entry
    const ledgerEntry = new VendorLedger({
      vendor: id,
      date: new Date(),
      description: description || (amount > 0 ? "Stock Purchased" : "Vendor Payment"),
      stockPurchased: amount > 0 ? amount : 0,
      paymentPaid: amount < 0 ? -amount : 0,
      balance: vendor.balance,
      owner: req.user._id
    });

    await ledgerEntry.save();

    res.status(200).json({ vendor, ledgerEntry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating vendor balance" });
  }
};
