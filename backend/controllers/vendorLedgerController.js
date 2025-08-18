const VendorLedger = require("../models/VendorLedger");
const Vendor = require("../models/Vendor");

// Add a vendor ledger entry
exports.addLedgerEntry = async (req, res) => {
  try {
    const { vendorId, description, stockPurchased = 0, paymentPaid = 0 } = req.body;

    const vendor = await Vendor.findOne({ _id: vendorId, owner: req.user._id });
    if (!vendor) return res.status(404).json({ message: "Vendor not found or not authorized" });

    const netChange = stockPurchased - paymentPaid;
    vendor.balance += netChange;
    await vendor.save();

    const ledgerEntry = new VendorLedger({
      vendor: vendorId,
      date: new Date(),
      description: description || (netChange > 0 ? "Stock Purchased" : "Vendor Payment"),
      stockPurchased,
      paymentPaid,
      balance: vendor.balance,
      owner: req.user._id
    });

    await ledgerEntry.save();
    res.status(201).json(ledgerEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add vendor ledger entry", error });
  }
};

// Get ledger entries for a specific vendor
exports.getVendorLedger = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await Vendor.findOne({ _id: vendorId, owner: req.user._id });
    if (!vendor) return res.status(404).json({ message: "Vendor not found or not authorized" });

    const ledgerEntries = await VendorLedger.find({ vendor: vendorId, owner: req.user._id })
      .sort({ date: -1 });

    res.status(200).json(ledgerEntries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch vendor ledger entries", error });
  }
};

// Get all vendor ledger entries (optional filters)
exports.getAllVendorLedgers = async (req, res) => {
  try {
    const { vendor, fromDate, toDate } = req.query;
    const query = { owner: req.user._id };

    if (vendor) query.vendor = vendor;

    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) {
        const start = new Date(fromDate);
        start.setHours(0, 0, 0, 0);
        query.date.$gte = start;
      }
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const filteredLedgerEntries = await VendorLedger.find(query).populate("vendor", "name")
      .sort({ date: 1 });
    res.status(200).json(filteredLedgerEntries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch vendor ledger entries", error });
  }
};
