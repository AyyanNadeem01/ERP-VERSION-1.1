import React, { useState } from "react";
import { createClient } from "../services/clientService";
import "../styles/clients.css";

const AddClientPage = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const [message, setMessage] = useState("");

  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createClient({
        name,
        address,
        balance: parseFloat(initialBalance) || 0,  // <-- added balance field
      });
      setName("");
      setAddress("");
      setInitialBalance("");
      setMessage("Client added successfully!");
    } catch (error) {
      console.error("Error adding client:", error);
      setMessage("Failed to add client.");
    }
  };

  return (
    <div className="fullscreen-wrapper">
      <header>
        <h1 className="addclient">Add New Client</h1>
      </header>

      <section className="form-section">
        <form onSubmit={handleAddClient}>
          <input
            type="text"
            placeholder="Client Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="number"
            placeholder="Initial Balance"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)}
          />
          <button type="submit">Add Client</button>
        </form>
        {message && <p className="success">{message}</p>}
      </section>
    </div>
  );
};

export default AddClientPage;
