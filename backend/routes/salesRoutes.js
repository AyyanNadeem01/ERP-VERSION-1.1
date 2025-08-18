const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesController");
const { authenticateToken } = require("../middlewares/authMiddleware");
// Add sale
router.post("/addsale",authenticateToken,salesController.addSale);

// Get all sales
router.get("/getallsales",authenticateToken,salesController.getAllSales);

// Get a specific sale
router.get("/getsale/:id",authenticateToken, salesController.getSaleById);

// Delete sale
router.delete("/deletesale/:id", authenticateToken,salesController.deleteSale);
// Update cost of a sale
router.put("/updatecost/:id", authenticateToken, salesController.updateSaleCost);

module.exports = router;
