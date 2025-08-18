import React, { useState, useEffect } from "react";
import { fetchClients } from "../services/clientService";
import { getItems } from "../services/itemService";
import { addSale } from "../services/salesService";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/addSale.css";

function AddSalePage() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [clientId, setClientId] = useState("");
  const [saleDate, setSaleDate] = useState(new Date());
  const [items, setItems] = useState([
    { srNo: 1, description: "", rate: null, quantity: null, total: 0 },
  ]);
  const [cost, setCost] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch clients, items, and invoice number
  useEffect(() => {
    fetchClients()
      .then((data) => setClients(Array.isArray(data) ? data : []))
      .catch(() => {
        setError("Failed to load clients");
        setClients([]);
      });

    getItems()
      .then((data) => setItemsList(Array.isArray(data) ? data : []))
      .catch(() => {
        setError("Failed to load items");
        setItemsList([]);
      });

    // Get and increment last invoice number
    const storedInvoiceNumber = localStorage.getItem("lastInvoiceNumber");
    const nextInvoiceNumber = storedInvoiceNumber
      ? parseInt(storedInvoiceNumber) + 1
      : 1100;
    setInvoiceNumber(nextInvoiceNumber.toString());
  }, []);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === "description" ? value : Number(value);
    
    // Calculate total if both rate and quantity are numbers
    if (field === "rate" || field === "quantity") {
      const rate = typeof newItems[index].rate === 'number' ? newItems[index].rate : 0;
      const quantity = typeof newItems[index].quantity === 'number' ? newItems[index].quantity : 0;
      newItems[index].total = rate * quantity;
    }
    
    setItems(newItems);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      { srNo: items.length + 1, description: "", rate: null, quantity: null, total: 0 },
    ]);
  };

  const removeItemRow = (index) => {
    if (items.length === 1) return;
    const newItems = items.filter((_, i) => i !== index);
    newItems.forEach((item, idx) => (item.srNo = idx + 1));
    setItems(newItems);
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const profit = totalAmount - (cost || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!invoiceNumber || !clientId) {
      setError("Invoice number and client selection are required.");
      return;
    }

    if (
      items.some(
        (item) =>
          !item.description || item.rate === null || item.quantity === null
      )
    ) {
      setError("All items must have description, rate, and quantity.");
      return;
    }

    setError("");
    try {
      const saleData = {
        invoiceNumber,
        clientId,
        date: saleDate.toISOString(),
        items,
        totalAmount,
        cost,
        profit,
      };
      await addSale(saleData);

      // Update last invoice number in localStorage
      localStorage.setItem("lastInvoiceNumber", invoiceNumber);

      setSuccessMsg("Sale added successfully!");
      // Reset form
      const storedInvoiceNumber = localStorage.getItem("lastInvoiceNumber");
      const nextInvoiceNumber = storedInvoiceNumber
        ? parseInt(storedInvoiceNumber) + 1
        : 1100;
      setInvoiceNumber(nextInvoiceNumber.toString());
      setClientId("");
      setSaleDate(new Date());
      setItems([{ srNo: 1, description: "", rate: null, quantity: null, total: 0 }]);
      setCost(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Sale error:", err);
      setError("Failed to add sale. Please try again.");
    }
  };

  return (
    <div className="add-sale-container">
      <h2>Add Sale (Invoice)</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <form onSubmit={handleSubmit} className="invoice-form">
        <div className="form-row">
          <div className="form-group">
            <label>Invoice Number:</label>
            <input
              type="text"
              value={invoiceNumber}
              readOnly
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Date:</label>
            <DatePicker
              selected={saleDate}
              onChange={(date) => setSaleDate(date)}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Client:</label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="form-control"
            required
          >
            <option value="">-- Select Client --</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name} {client.address && `(${client.address})`}
              </option>
            ))}
          </select>
        </div>

        <h3>Items</h3>
        <div className="table-responsive">
          <table className="items-table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Description</th>
                <th>Rate (Rs.)</th>
                <th>Quantity</th>
                <th>Total (Rs.)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.srNo}</td>
                  <td>
                    <select
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(idx, "description", e.target.value)
                      }
                      className="form-control"
                      required
                    >
                      <option value="">-- Select Item --</option>
                      {itemsList.map((itm) => (
                        <option key={itm._id} value={itm.itemName}>
                          {itm.itemName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.rate === null ? '' : item.rate}
                      min="0"
                      step="0.01"
                      onChange={(e) =>
                        handleItemChange(idx, "rate", e.target.value)
                      }
                      className="form-control"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity === null ? '' : item.quantity}
                      min="0.01"
                      step="0.01"
                      onChange={(e) =>
                        handleItemChange(idx, "quantity", e.target.value)
                      }
                      className="form-control"
                      required
                    />
                  </td>
                  <td>{(item.total || 0).toFixed(2)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeItemRow(idx)}
                      disabled={items.length === 1}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          className="btn btn-secondary mt-2 mb-3"
          onClick={addItemRow}
        >
          + Add Item
        </button>

        <div className="summary-section">
          <div className="form-group">
            <label>Cost (Rs.):</label>
            <input
              type="number"
              value={cost === null ? '' : cost}
              min="0"
              step="0.01"
              onChange={(e) => setCost(e.target.value === '' ? null : Number(e.target.value))}
              className="form-control"
            />
          </div>
          <div className="summary-item">
            <strong>Total Amount: </strong>Rs.{totalAmount.toFixed(2)}
          </div>
          <div className="summary-item">
            <strong>Profit: </strong>Rs.{profit.toFixed(2)}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Add Sale
          </button>
          <button 
            type="button" 
            className="btn btn-outline-secondary ml-2"
            onClick={() => navigate('/sales')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddSalePage;