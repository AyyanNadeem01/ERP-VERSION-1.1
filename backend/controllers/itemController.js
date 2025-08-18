const Item = require("../models/itemModel");

// Add a new item
exports.addItem = async (req, res) => {
  try {
    const { itemName, stock, costPrice } = req.body;
    if (!itemName) {
      return res.status(400).json({ message: "Item name is required" });
    }

    const newItem = new Item({
      itemName,
      stock: stock || 0,
      costPrice: costPrice || 0,
      owner: req.user._id, // assign owner automatically
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete an item by ID (only if it belongs to the user)
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findOneAndDelete({ _id: id, owner: req.user._id });

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found or not authorized" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all items for the logged-in user
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user._id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update stock and/or cost price of an item (only if it belongs to the user)
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, costPrice } = req.body;

    const updateData = {};
    if (stock != null) updateData.stock = stock;
    if (costPrice != null) updateData.costPrice = costPrice;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updatedItem = await Item.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      updateData,
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found or not authorized" });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
