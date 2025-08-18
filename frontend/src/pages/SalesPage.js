import React, { useEffect, useState } from "react"; 
import { getAllSales, deleteSale } from "../services/salesService";
import axiosInstance from "../services/axiosInstance"; // For updateCost API
import "../styles/sales.css";

// Utility to get today's date string in 'YYYY-MM-DD' format for Pakistan timezone (UTC+5)
function getPakistanTodayDateString() {
  const now = new Date();
  const pakTime = new Date(now.getTime() + 5 * 60 * 60 * 1000);
  return pakTime.toISOString().slice(0, 10);
}

function SalesPage() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [clients, setClients] = useState([]);

  const todayPakistan = getPakistanTodayDateString();

  const [filterDateFrom, setFilterDateFrom] = useState(todayPakistan);
  const [filterDateTo, setFilterDateTo] = useState(todayPakistan);
  const [filterClient, setFilterClient] = useState("");

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = () => {
    getAllSales()
      .then((response) => {
        setSales(response.data);
        setFilteredSales(response.data);

        const uniqueClients = Array.from(
          new Set(response.data.map((sale) => sale.client?.name).filter(Boolean))
        );
        setClients(uniqueClients);
      })
      .catch((error) => console.error("Error fetching sales:", error));
  };

  useEffect(() => {
    let filtered = sales;

    if (filterDateFrom) {
      const fromDate = new Date(filterDateFrom);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter((sale) => {
        const saleDate = new Date(sale.date);
        saleDate.setHours(0, 0, 0, 0);
        return saleDate >= fromDate;
      });
    }

    if (filterDateTo) {
      const toDate = new Date(filterDateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((sale) => {
        const saleDate = new Date(sale.date);
        saleDate.setHours(0, 0, 0, 0);
        return saleDate <= toDate;
      });
    }

    if (filterClient) {
      filtered = filtered.filter((sale) => sale.client?.name === filterClient);
    }

    setFilteredSales(filtered);
  }, [filterDateFrom, filterDateTo, filterClient, sales]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this sale?")) {
      deleteSale(id)
        .then(() => {
          alert("Sale deleted successfully.");
          fetchSales();
        })
        .catch((error) => console.error("Error deleting sale:", error));
    }
  };

  const handleUpdateCost = async (saleId, currentCost) => {
    const newCostStr = window.prompt("Enter new cost:", currentCost || 0);
    if (newCostStr === null) return; // Cancelled
    const newCost = parseFloat(newCostStr);
    if (isNaN(newCost) || newCost < 0) {
      alert("Invalid cost entered!");
      return;
    }

    try {
      await axiosInstance.put(`/sales/updatecost/${saleId}`, { cost: newCost });
      alert("Cost updated successfully.");
      fetchSales();
    } catch (error) {
      console.error("Error updating cost:", error);
      alert("Failed to update cost.");
    }
  };

  const totalOutstanding = filteredSales.reduce(
    (sum, sale) => sum + (sale.totalAmount || 0),
    0
  );

  const totalProfit = filteredSales.reduce(
    (sum, sale) => sum + (sale.profit || 0),
    0
  );

  return (
    <div className="sales-container">
      <h2>Sales Records</h2>

      {/* Filters */}
      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="date-from">From Date:</label>
          <input
            type="date"
            id="date-from"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            max={todayPakistan}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="date-to">To Date:</label>
          <input
            type="date"
            id="date-to"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            max={todayPakistan}
            min={filterDateFrom}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="client-filter">Client:</label>
          <select
            id="client-filter"
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
          >
            <option value="">All Clients</option>
            {clients.map((clientName) => (
              <option key={clientName} value={clientName}>
                {clientName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Bar */}
      <div className="top-bar">
        <button className="add-btn" onClick={() => (window.location.href = "/addsale")}>
          + Add New Sale
        </button>
        <span className="total-count">
          {filteredSales.length} {filteredSales.length === 1 ? "sale" : "sales"}
        </span>
        <span className="total-outstanding">| Total Sales: Rs.{totalOutstanding.toFixed(2)}</span>
        <span className="total-profit">| Total Profit: Rs.{totalProfit.toFixed(2)}</span>
      </div>

      {/* Sales Table */}
      <div className="table-wrapper">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Date</th>
              <th>Client</th>
              <th>Address</th>
              <th>Total Amount</th>
              <th>Profit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  No sales found.
                </td>
              </tr>
            ) : (
              filteredSales.map((sale) => (
                <tr key={sale._id}>
                  <td data-label="Invoice #">{sale.invoiceNumber}</td>
                  <td data-label="Date">{new Date(sale.date).toLocaleDateString()}</td>
                  <td data-label="Client">{sale.client?.name || "-"}</td>
                  <td data-label="Address">{sale.client?.address || "-"}</td>
                  <td data-label="Total Amount">Rs.{sale.totalAmount?.toFixed(2) || "0.00"}</td>
                  <td
                    data-label="Profit"
                    className={sale.profit >= 0 ? "profit-positive" : "profit-negative"}
                  >
                    Rs.{sale.profit?.toFixed(2) || "0.00"}
                  </td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => (window.location.href = `/sales/${sale._id}`)}
                    >
                      Go to Invoice
                    </button>
                    <button
                      className="update-btn"
                      onClick={() => handleUpdateCost(sale._id, sale.cost)}
                    >
                      Update Cost
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(sale._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesPage;
