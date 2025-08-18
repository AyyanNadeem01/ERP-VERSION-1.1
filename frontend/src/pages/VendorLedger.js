
// import React, { useState, useEffect, useCallback } from "react";
// import { getFilteredVendorLedgers } from "../services/vendorLedgerService";
// import { getVendors } from "../services/vendorService";
// import "../styles/vendorledger.css";

// const VendorLedger = () => {
//   const [vendorId, setVendorId] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [ledgerData, setLedgerData] = useState([]);
//   const [vendorMap, setVendorMap] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Helper function to get today's date in Pakistan
//   const getPakistanToday = () => {
//     return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });
//   };

//   // Memoized function to fetch all vendors and populate the map
//   const fetchVendors = useCallback(async () => {
//     try {
//       // Correctly handle the response by directly using the returned array
//       const vendors = await getVendors(); 
//       const map = {};
//       if (vendors && Array.isArray(vendors)) {
//         vendors.forEach((v) => {
//           map[v._id] = v.name;
//         });
//       }
//       setVendorMap(map);
//     } catch (err) {
//       console.error("Failed to fetch vendors", err);
//       // You can also set an error state here if you want to display it
//       // setError("Failed to load vendor names for the filter.");
//     }
//   }, []);

//   // Memoized function to handle filtering the ledger data
//   const handleFilter = useCallback(
//     async (e) => {
//       if (e) e.preventDefault();
//       setLoading(true);
//       setError(null);

//       try {
//         const response = await getFilteredVendorLedgers({
//           vendor: vendorId,
//           fromDate,
//           toDate,
//         });
//         setLedgerData(response.data);
//       } catch (err) {
//         setError("Failed to fetch ledger data.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [vendorId, fromDate, toDate]
//   );

//   // Effect to initialize dates and fetch vendors on component mount
//   useEffect(() => {
//     const today = getPakistanToday();
//     setFromDate(today);
//     setToDate(today);
//     fetchVendors();
//   }, [fetchVendors]);

//   // Effect to re-filter data when dependencies change
//   useEffect(() => {
//     if (fromDate && toDate) {
//       handleFilter();
//     }
//   }, [vendorId, fromDate, toDate, handleFilter]);

//   // Compute totals for the displayed data
//   const totalStockPurchased = ledgerData.reduce(
//     (sum, entry) => sum + (Number(entry.stockPurchased) || 0),
//     0
//   );
//   const totalPaymentPaid = ledgerData.reduce(
//     (sum, entry) => sum + (Number(entry.paymentPaid) || 0),
//     0
//   );

//   return (
//     <div className="ledger-container">
//       <h2>Vendor Ledger Report</h2>

//       {/* Filter form */}
//       <form onSubmit={handleFilter} className="filter-section">
//         <select
//           value={vendorId}
//           onChange={(e) => setVendorId(e.target.value)}
//         >
//           <option value="">-- Select Vendor --</option>
//           {Object.entries(vendorMap).map(([id, name]) => (
//             <option key={id} value={id}>
//               {name}
//             </option>
//           ))}
//         </select>

//         <input
//           type="date"
//           value={fromDate}
//           onChange={(e) => setFromDate(e.target.value)}
//         />
//         <input
//           type="date"
//           value={toDate}
//           onChange={(e) => setToDate(e.target.value)}
//         />
//         <button type="submit" className="filter-btn">
//           Apply Filter
//         </button>
//       </form>

//       {/* Loading and error messages */}
//       {loading && <p>Loading...</p>}
//       {error && <p className="error-text">{error}</p>}

//       {/* Totals display */}
//       <div className="totals-section">
//         <p><strong>Total Stock Purchased:</strong> {totalStockPurchased}</p>
//         <p><strong>Total Payment Paid:</strong> {totalPaymentPaid}</p>
//       </div>

//       {/* Ledger table */}
//       <table className="ledger-table">
//         <thead>
//           <tr>
//             <th>Date</th>
//             <th>Vendor</th>
//             <th>Description</th>
//             <th>Stock Purchased</th>
//             <th>Payment Paid</th>
//             <th>Balance</th>
//           </tr>
//         </thead>
//         <tbody>
//           {ledgerData.length === 0 ? (
//             <tr>
//               <td colSpan="6">No records found.</td>
//             </tr>
//           ) : (
//             ledgerData
//               .sort((a, b) => new Date(a.date) - new Date(b.date))
//               .map((entry) => (
//                 <tr key={entry._id}>
//                   <td>{new Date(entry.date).toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" })}</td>
//                   <td>{entry.vendor?.name || "N/A"}</td>
//                   <td>{entry.description}</td>
//                   <td>{entry.stockPurchased}</td>
//                   <td>{entry.paymentPaid}</td>
//                   <td>{entry.balance}</td>
//                 </tr>
//               ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default VendorLedger;
import React, { useState, useEffect, useCallback } from "react";
import { getFilteredVendorLedgers } from "../services/vendorLedgerService";
import { getVendors } from "../services/vendorService";
import "../styles/vendorledger.css";
import html2pdf from "html2pdf.js";

const VendorLedger = () => {
  const [vendorId, setVendorId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [ledgerData, setLedgerData] = useState([]);
  const [vendorMap, setVendorMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to get today's date in Pakistan
  const getPakistanToday = () => {
    return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });
  };

  // Fetch vendors and populate map
  const fetchVendors = useCallback(async () => {
    try {
      const vendors = await getVendors();
      const map = {};
      if (vendors && Array.isArray(vendors)) {
        vendors.forEach((v) => {
          map[v._id] = v.name;
        });
      }
      setVendorMap(map);
    } catch (err) {
      console.error("Failed to fetch vendors", err);
    }
  }, []);

  // Filter ledger data
  const handleFilter = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        const response = await getFilteredVendorLedgers({
          vendor: vendorId,
          fromDate,
          toDate,
        });
        setLedgerData(response.data);
      } catch (err) {
        setError("Failed to fetch ledger data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [vendorId, fromDate, toDate]
  );

  // Initialize dates and vendors on mount
  useEffect(() => {
    const today = getPakistanToday();
    setFromDate(today);
    setToDate(today);
    fetchVendors();
  }, [fetchVendors]);

  // Auto-refresh ledger on dependency change
  useEffect(() => {
    if (fromDate && toDate) {
      handleFilter();
    }
  }, [vendorId, fromDate, toDate, handleFilter]);

  // Compute totals
  const totalStockPurchased = ledgerData.reduce(
    (sum, entry) => sum + (Number(entry.stockPurchased) || 0),
    0
  );
  const totalPaymentPaid = ledgerData.reduce(
    (sum, entry) => sum + (Number(entry.paymentPaid) || 0),
    0
  );

  // Download PDF
  const handleDownloadPDF = () => {
    const element = document.getElementById("ledger-table-wrapper");
    const opt = {
      margin: 0.5,
      filename: `Vendor_Ledger_${fromDate}_to_${toDate}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="ledger-container">
      <h2>Vendor Ledger Report</h2>

      {/* Filter form */}
      <form onSubmit={handleFilter} className="filter-section">
        <select value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
          <option value="">-- Select Vendor --</option>
          {Object.entries(vendorMap).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <button type="submit" className="filter-btn">
          Apply Filter
        </button>

        <button
          type="button"
          className="download-btn"
          onClick={handleDownloadPDF}
        >
          Download PDF
        </button>
      </form>

      {/* Loading and error messages */}
      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      {/* Ledger table and totals wrapper for PDF */}
      <div id="ledger-table-wrapper">
        {/* Totals display */}
        <div className="totals-section">
          <p>
            <strong>Total Stock Purchased:</strong> {totalStockPurchased}
          </p>
          <p>
            <strong>Total Payment Paid:</strong> {totalPaymentPaid}
          </p>
        </div>

        {/* Ledger table */}
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Vendor</th>
              <th>Description</th>
              <th>Stock Purchased</th>
              <th>Payment Paid</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {ledgerData.length === 0 ? (
              <tr>
                <td colSpan="6">No records found.</td>
              </tr>
            ) : (
              ledgerData
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((entry) => (
                  <tr key={entry._id}>
                    <td>
                      {new Date(entry.date).toLocaleDateString("en-CA", {
                        timeZone: "Asia/Karachi",
                      })}
                    </td>
                    <td>{entry.vendor?.name || "N/A"}</td>
                    <td>{entry.description}</td>
                    <td>{entry.stockPurchased}</td>
                    <td>{entry.paymentPaid}</td>
                    <td>{entry.balance}</td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorLedger;
