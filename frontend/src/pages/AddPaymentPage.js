import React, { useEffect, useState } from "react";
import { fetchClients, updateClientBalance } from "../services/clientService";
import "../styles/clients.css";

const AddPaymentPage = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [message, setMessage] = useState("");

  const loadClients = async () => {
    try {
      const data = await fetchClients();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!selectedClient || !amount) {
      alert("Please select a client and enter amount.");
      return;
    }

    const confirmPayment = window.confirm(
      `Are you sure you want to add a payment of Rs. ${amount}?`
    );
    if (!confirmPayment) return;

    const finalAmount = -parseFloat(amount);

    try {
      await updateClientBalance(selectedClient, finalAmount, remarks);
      setMessage("Payment added successfully!");
      setAmount("");
      setRemarks("");
      setSelectedClient("");
      loadClients();
    } catch (error) {
      console.error("Error adding payment:", error);
      setMessage("Failed to add payment.");
    }
  };

  return (
    <div className="fullscreen-wrapper">
      <header>
        <h1 className="addclient">Add Client Payment</h1>
      </header>

      <section className="form-section">
        <form onSubmit={handleAddPayment}>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            required
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name} (Balance: Rs. {client.balance})
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />

          <button type="submit">Add Payment</button>
        </form>
        {message && <p className="success">{message}</p>}
      </section>
    </div>
  );
};

export default AddPaymentPage;
