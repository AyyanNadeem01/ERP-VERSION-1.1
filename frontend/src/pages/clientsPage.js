import React, { useEffect, useState } from "react";
import {
  fetchClients,
  createClient,
  updateClientBalance,
} from "../services/clientService";
import "../styles/clients.css";

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [address, setAddress] = useState("");
  const [remarks, setRemarks] = useState("");
  const [message, setMessage] = useState("");
  const [updateAmount, setUpdateAmount] = useState({});
  const [updateRemarks, setUpdateRemarks] = useState({});
  const [updateType, setUpdateType] = useState({});

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

  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createClient({
        name,
        balance: parseFloat(balance) || 0,
        address,
        remarks,
      });
      setName("");
      setBalance("");
      setAddress("");
      setRemarks("");
      setMessage("Client added successfully!");
      loadClients();
    } catch (error) {
      console.error("Error adding client:", error);
      setMessage("Failed to add client.");
    }
  };

  const handleUpdateBalance = async (clientId) => {
    const amount = parseFloat(updateAmount[clientId]);
    const remarksText = updateRemarks[clientId] || "";
    const type = updateType[clientId] || "add";

    if (isNaN(amount)) return;

    const finalAmount = type === "subtract" ? -amount : amount;

    try {
      await updateClientBalance(clientId, finalAmount, remarksText);
      setMessage("Client balance updated!");
      loadClients();
    } catch (error) {
      console.error("Error updating balance:", error);
      setMessage("Failed to update balance.");
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
        <h1>Clients Management</h1>
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
            type="number"
            placeholder="Balance"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
          <button type="submit">Add Client</button>
        </form>
        {message && <p className="success">{message}</p>}
      </section>

      <section className="clients-table-section">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Balance</th>
              <th>Address</th>
              <th>Remarks</th>
              <th>Update Balance</th>
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
                    <select
                      value={updateType[client._id] || "add"}
                      onChange={(e) =>
                        handleInputChange(e, setUpdateType, client._id)
                      }
                    >
                      <option value="add">Add</option>
                      <option value="subtract">Subtract</option>
                    </select>
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
                    <button onClick={() => handleUpdateBalance(client._id)}>
                      Update
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

export default ClientsPage;
