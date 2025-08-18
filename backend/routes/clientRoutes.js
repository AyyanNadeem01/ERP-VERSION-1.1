const express = require("express");
const router = express.Router();
const {authenticateToken} = require("../middlewares/authMiddleware");
const {
  getClients,
  addClient,
  updateClientBalance,
} = require("../controllers/clientController");
// /api/clients/
router.get("/getclients", authenticateToken,getClients);
router.post("/addclient",authenticateToken,addClient);

// /api/clients/:id/balance
router.put("/client/:id/balance",authenticateToken, updateClientBalance);

module.exports = router;
