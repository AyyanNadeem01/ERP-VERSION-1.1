import React, { useEffect, useState } from "react";
import {
  fetchClients,
  updateClientBalance,
} from "../services/clientService";
import "../styles/clients.css";

const ClientsListPage = () => {
  const [clients, setClients] = useState([]);
  const [updateAmount, setUpdateAmount] = useState({});
  const [updateRemarks, setUpdateRemarks] = useState({});
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

  const handleReceivePayment = async (clientId) => {
    const amount = parseFloat(updateAmount[clientId]);
    const remarksText = updateRemarks[clientId] || "";

    if (isNaN(amount) || amount <= 0) return;

    try {
      await updateClientBalance(clientId, -amount, remarksText); // subtract payment
      setMessage("Payment received successfully!");
      loadClients();
    } catch (error) {
      console.error("Error receiving payment:", error);
      setMessage("Failed to process payment.");
    }
  };

  const handleInputChange = (e, setter, clientId) => {
    setter((prev) => ({
      ...prev,
      [clientId]: e.target.value,
    }));
  };

  return (
    <div className="fullscreen-wrapper">
      <header>
        <h1>Clients List</h1>
      </header>

      {message && <p className="success">{message}</p>}

      <section className="clients-table-section">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Balance</th>
              <th>Address</th>
              <th>Remarks</th>
              <th>Receive Payment</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client._id}>
                <td>{client.name}</td>
                <td>${client.balance}</td>
                <td>{client.address || "None"}</td>
                <td>{client.remarks || "None"}</td>
                <td>
                  <div className="update-form">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={updateAmount[client._id] || ""}
                      onChange={(e) =>
                        handleInputChange(e, setUpdateAmount, client._id)
                      }
                    />
                    <input
                      type="text"
                      placeholder="Remarks"
                      value={updateRemarks[client._id] || ""}
                      onChange={(e) =>
                        handleInputChange(e, setUpdateRemarks, client._id)
                      }
                    />
                    <button onClick={() => handleReceivePayment(client._id)}>
                      Receive
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ClientsListPage;
