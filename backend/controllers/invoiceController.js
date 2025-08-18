const Invoice = require("../models/Invoice");
const Sale = require("../models/Sale");

// POST: /api/invoice/ — generate a new invoice
exports.generateInvoice = async (req, res, next) => {
  try {
    const { invoiceNumber, date, client, items } = req.body;
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

    const invoice = new Invoice({
      invoiceNumber,
      date,
      client,
      items,
      totalAmount,
      owner: req.user._id, // assign owner automatically
    });
    await invoice.save();

    const sale = new Sale({
      invoiceNumber,
      date,
      totalAmount,
      owner: req.user._id, // optional: make sale also user-specific
    });
    await sale.save();

    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
};

// GET: /api/invoice/:id — get invoice data (user-specific)
exports.generateInvoiceImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findOne({ _id: id, owner: req.user._id });
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found or not authorized" });
    }

    // Here you can later generate image logic (for now just returning invoice)
    res.status(200).json(invoice);
  } catch (error) {
    next(error);
  }
};
