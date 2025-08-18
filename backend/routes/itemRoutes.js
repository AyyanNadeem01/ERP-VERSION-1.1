const express = require("express");
const router = express.Router();
const { addItem, deleteItem, getItems, updateItem } = require("../controllers/itemController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Get all items
router.get("/", authenticateToken, getItems);

// Add new item
router.post("/add", authenticateToken, addItem);

// Delete item by ID
router.delete("/delete/:id", authenticateToken, deleteItem);

// Update stock and/or costPrice by ID
router.put("/update/:id", authenticateToken, updateItem); // <-- changed to PUT

module.exports = router;
