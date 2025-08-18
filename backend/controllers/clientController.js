// const Client = require("../models/Client");
// const Ledger = require("../models/Ledger");

// // Get all clients for the logged-in user
// exports.getClients = async (req, res, next) => {
//   try {
//     const clients = await Client.find({ owner: req.user._id });
//     res.json(clients);
//   } catch (error) {
//     next(error);
//   }
// };

// // Add a new client for the logged-in user
// exports.addClient = async (req, res, next) => {
//   try {
//     const client = new Client({
//       ...req.body,
//       owner: req.user._id, // assign owner automatically
//     });
//     await client.save();
//     res.status(201).json(client);
//   } catch (error) {
//     next(error);
//   }
// };

// // Update client balance (only if it belongs to the user)
// exports.updateClientBalance = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { amount, remarks } = req.body;

//     const client = await Client.findOne({ _id: id, owner: req.user._id });
//     if (!client) {
//       return res.status(404).json({ message: "Client not found or not authorized" });
//     }

//     // Update client balance
//     client.balance += amount;
//     client.remarks = remarks;
//     await client.save();

//     // Create ledger entry
//     const ledgerEntry = new Ledger({
//       client: client._id,
//       description: remarks || (amount < 0 ? "Payment received" : "Balance updated"),
//       debit: amount > 0 ? amount : 0,
//       credit: amount < 0 ? Math.abs(amount) : 0,
//       balanceAfter: client.balance,
//     });

//     await ledgerEntry.save();

//     res.status(200).json(client);
//   } catch (error) {
//     next(error);
//   }
// };
const Client = require("../models/Client");
const Ledger = require("../models/Ledger");
const mongoose = require("mongoose"); // Import Mongoose for transactions

// Get all clients for the logged-in user
exports.getClients = async (req, res, next) => {
  try {
    const clients = await Client.find({ owner: req.user._id });
    res.json(clients);
  } catch (error) {
    next(error);
  }
};

// Add a new client for the logged-in user
exports.addClient = async (req, res, next) => {
  try {
    const client = new Client({
      ...req.body,
      owner: req.user._id, // assign owner automatically
    });
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

// Update client balance (only if it belongs to the user)
exports.updateClientBalance = async (req, res, next) => {
  // Start a Mongoose session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { amount, remarks } = req.body;

    // Find the client within the transaction session
    const client = await Client.findOne({ _id: id, owner: req.user._id }).session(session);
    if (!client) {
      // Abort the transaction if the client is not found
      await session.abortTransaction();
      return res.status(404).json({ message: "Client not found or not authorized" });
    }

    // Update client balance
    client.balance += amount;
    client.remarks = remarks;
    await client.save({ session }); // Pass the session to the save method

    // Create and save the ledger entry within the transaction
    const ledgerEntry = new Ledger({
      client: client._id,
      description: remarks || (amount < 0 ? "Payment received" : "Balance updated"),
      debit: amount > 0 ? amount : 0,
      credit: amount < 0 ? Math.abs(amount) : 0,
      balanceAfter: client.balance,
      owner: req.user._id // Add owner to ledger entry for security
    });

    await ledgerEntry.save({ session }); // Pass the session to the save method

    // If all operations were successful, commit the transaction
    await session.commitTransaction();
    res.status(200).json(client);

  } catch (error) {
    // If any error occurred, abort the transaction to undo all changes
    await session.abortTransaction();
    console.error("Transaction aborted:", error);
    next(error);
  } finally {
    // Always end the session
    session.endSession();
  }
};
