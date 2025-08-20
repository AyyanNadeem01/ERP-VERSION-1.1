import React, { useEffect, useState } from "react";
import { getAllLedgers } from "../services/ledgerService";
import "../styles/CollectionPage.css";

const CollectionPage = () => {
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await getAllLedgers();
      const data = response.data;

      // Only take "payments received" (credit > 0)
      const payments = data.filter((entry) => entry.credit > 0);

      setCollections(payments);
      setFilteredCollections(payments);

      const today = new Date();
      const todayLocal = today.toISOString().split("T")[0];
      setFromDate(todayLocal);
      setToDate(todayLocal);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  const applyFilters = () => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates.");
      return;
    }

    const from = normalizeDate(fromDate);
    const to = normalizeDate(toDate);

    const result = collections.filter((entry) => {
      const entryDate = normalizeDate(entry.date);
      return entryDate >= from && entryDate <= to;
    });

    setFilteredCollections(result);
  };

  const resetFilters = () => {
    setFilteredCollections(collections);
    const todayLocal = new Date().toISOString().split("T")[0];
    setFromDate(todayLocal);
    setToDate(todayLocal);
  };

  const calculateTotal = () => {
    let total = 0;
    filteredCollections.forEach((entry) => {
      total += entry.credit || 0;
    });
    return total;
  };

  return (
    <div className="collection-container">
      <h2 className="collection-heading">Collections Report</h2>

      {/* Filters */}
      <div className="collection-filter-section">
        <div>
          <label>From: </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          <label>To: </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <button onClick={applyFilters} className="filter-button">
          Apply Filters
        </button>
        <button onClick={resetFilters} className="reset-button">
          Reset
        </button>
      </div>

      {/* Totals */}
      <div className="collection-totals">
        <p>
          <strong>Total Collection:</strong> PKR {calculateTotal()}
        </p>
      </div>

      {/* Collection Table */}
      <table className="collection-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Client Name</th>
            <th>Client Address</th>
            <th>Description</th>
            <th>Amount Received (CR)</th>
          </tr>
        </thead>
        <tbody>
          {filteredCollections.map((entry, index) => (
            <tr key={index}>
              <td>{formatDate(entry.date)}</td>
              <td>{entry.client?.name || "N/A"}</td>
              <td>{entry.client?.address || "N/A"}</td>
              <td>{entry.description}</td>
              <td>{`PKR ${entry.credit}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollectionPage;
