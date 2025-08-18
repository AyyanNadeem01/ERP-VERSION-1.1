// import React, { useEffect, useState } from "react";
// import { getAllLedgers } from "../services/ledgerService";
// import "../styles/LedgerPage.css";

// const LedgerPage = () => {
//   const [ledgers, setLedgers] = useState([]);
//   const [filteredLedgers, setFilteredLedgers] = useState([]);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [clientNames, setClientNames] = useState([]);
//   const [clientAddresses, setClientAddresses] = useState([]);
//   const [clientAddressMap, setClientAddressMap] = useState({});
//   const [selectedName, setSelectedName] = useState("");
//   const [selectedAddress, setSelectedAddress] = useState("");
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };
  
//   // Helper to get local date string YYYY-MM-DD (not UTC)
//   const getLocalDateString = () => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, "0");
//     const day = String(today.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   useEffect(() => {
//     fetchLedgers();
//   }, []);

//   const fetchLedgers = async () => {
//     try {
//       const response = await getAllLedgers();
//       const data = response.data;

//       const today = new Date();
//       const fifteenDaysAgo = new Date();
//       fifteenDaysAgo.setDate(today.getDate() - 15);

//       setLedgers(data);
//       setFilteredLedgers(
//         data.filter(
//           (entry) =>
//             normalizeDate(entry.date) >= normalizeDate(fifteenDaysAgo) &&
//             normalizeDate(entry.date) <= normalizeDate(today)
//         )
//       );

//       // Set fromDate and toDate to today's local date by default
//       const todayLocal = getLocalDateString();
//       setFromDate(todayLocal);
//       setToDate(todayLocal);

//       const names = Array.from(
//         new Set(data.map((entry) => entry.client?.name).filter(Boolean))
//       );

//       const addressMap = {};
//       data.forEach((entry) => {
//         if (entry.client?.name && entry.client?.address) {
//           if (!addressMap[entry.client.name]) {
//             addressMap[entry.client.name] = new Set();
//           }
//           addressMap[entry.client.name].add(entry.client.address);
//         }
//       });

//       for (const key in addressMap) {
//         addressMap[key] = Array.from(addressMap[key]);
//       }

//       setClientNames(names);
//       setClientAddressMap(addressMap);
//     } catch (error) {
//       console.error("Error fetching ledger entries:", error);
//     }
//   };

//   const normalizeDate = (date) => {
//     const d = new Date(date);
//     d.setHours(0, 0, 0, 0);
//     return d;
//   };

//   const handleNameChange = (e) => {
//     const name = e.target.value;
//     setSelectedName(name);
//     setSelectedAddress("");

//     if (name) {
//       setClientAddresses(clientAddressMap[name] || []);
//     } else {
//       setClientAddresses([]);
//     }
//   };

//   const applyFilters = () => {
//     if (!fromDate || !toDate) {
//       alert("Please select both From and To dates.");
//       return;
//     }

//     const from = normalizeDate(fromDate);
//     const to = normalizeDate(toDate);

//     const result = ledgers.filter((entry) => {
//       const entryDate = normalizeDate(entry.date);
//       const inDateRange = entryDate >= from && entryDate <= to;

//       const matchesName = selectedName
//         ? entry.client?.name === selectedName
//         : true;

//       const matchesAddress = selectedAddress
//         ? entry.client?.address === selectedAddress
//         : true;

//       return inDateRange && matchesName && matchesAddress;
//     });

//     setFilteredLedgers(result);
//   };

//   const resetFilters = () => {
//     const todayLocal = getLocalDateString();

//     setFromDate(todayLocal);
//     setToDate(todayLocal);
//     setSelectedName("");
//     setSelectedAddress("");
//     setClientAddresses([]);

//     setFilteredLedgers(
//       ledgers.filter((entry) => {
//         const entryDate = normalizeDate(entry.date);
//         const todayDate = normalizeDate(todayLocal);
//         return entryDate.getTime() === todayDate.getTime();
//       })
//     );
//   };

//   const calculateTotals = () => {
//     let totalDebit = 0;
//     let totalCredit = 0;

//     filteredLedgers.forEach((entry) => {
//       totalDebit += entry.debit || 0;
//       totalCredit += entry.credit || 0;
//     });

//     return { totalDebit, totalCredit };
//   };

//   const { totalDebit, totalCredit } = calculateTotals();

//   return (
//     <div className="ledger-container">
//       <h2 className="ledger-heading">Ledger Book</h2>

//       {/* Filters */}
//       <div className="filter-section">
//         <div>
//           <label>From: </label>
//           <input
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//           />
//         </div>

//         <div>
//           <label>To: </label>
//           <input
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//           />
//         </div>

//         <div>
//           <label>Client Name: </label>
//           <select value={selectedName} onChange={handleNameChange}>
//             <option value="">All</option>
//             {clientNames.map((name, idx) => (
//               <option key={idx} value={name}>
//                 {name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label>Client Address: </label>
//           <select
//             value={selectedAddress}
//             onChange={(e) => setSelectedAddress(e.target.value)}
//             disabled={!selectedName}
//           >
//             <option value="">All</option>
//             {clientAddresses.map((address, idx) => (
//               <option key={idx} value={address}>
//                 {address}
//               </option>
//             ))}
//           </select>
//         </div>

//         <button onClick={applyFilters} className="filter-button">
//           Apply Filters
//         </button>
//         <button onClick={resetFilters} className="reset-button">
//           Reset Filters
//         </button>
//       </div>

//       {/* Totals */}
//       <div className="totals-section">
//         <p>
//           <strong>Total Debit:</strong> PKR {totalDebit}
//         </p>
//         <p>
//           <strong>Total Credit:</strong> PKR {totalCredit}
//         </p>
//       </div>

//       {/* Ledger Table */}
//       <table className="ledger-table">
//         <thead>
//           <tr>
//             <th>Date</th>
//             <th>Client Name</th>
//             <th>Client Address</th>
//             <th>Description</th>
//             <th>Debit (DB)</th>
//             <th>Credit (CR)</th>
//             <th>Balance</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredLedgers.map((entry, index) => (
//             <tr key={index}>
//               <td data-label="Date">
//                 {formatDate(entry.date)}
//               </td>
//               <td data-label="Client Name">{entry.client?.name || "N/A"}</td>
//               <td data-label="Client Address">{entry.client?.address || "N/A"}</td>
//               <td data-label="Description">{entry.description}</td>
//               <td data-label="Debit (DB)">
//                 {entry.debit ? `PKR ${entry.debit}` : "-"}
//               </td>
//               <td data-label="Credit (CR)">
//                 {entry.credit ? `PKR ${entry.credit}` : "-"}
//               </td>
//               <td data-label="Balance">{`PKR ${entry.balanceAfter}`}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default LedgerPage;

import React, { useEffect, useState } from "react";
import { getAllLedgers } from "../services/ledgerService";
import "../styles/LedgerPage.css";
import htm2pdf from "html2pdf.js"; // Import htm2pdf

const LedgerPage = () => {
  const [ledgers, setLedgers] = useState([]);
  const [filteredLedgers, setFilteredLedgers] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [clientNames, setClientNames] = useState([]);
  const [clientAddresses, setClientAddresses] = useState([]);
  const [clientAddressMap, setClientAddressMap] = useState({});
  const [selectedName, setSelectedName] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getLocalDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchLedgers();
  }, []);

  const fetchLedgers = async () => {
    try {
      const response = await getAllLedgers();
      const data = response.data;

      setLedgers(data);
      setFilteredLedgers(data); // initially show all

      const todayLocal = getLocalDateString();
      setFromDate(todayLocal);
      setToDate(todayLocal);

      const names = Array.from(
        new Set(data.map((entry) => entry.client?.name).filter(Boolean))
      );

      const addressMap = {};
      data.forEach((entry) => {
        if (entry.client?.name && entry.client?.address) {
          if (!addressMap[entry.client.name]) {
            addressMap[entry.client.name] = new Set();
          }
          addressMap[entry.client.name].add(entry.client.address);
        }
      });

      for (const key in addressMap) {
        addressMap[key] = Array.from(addressMap[key]);
      }

      setClientNames(names);
      setClientAddressMap(addressMap);
    } catch (error) {
      console.error("Error fetching ledger entries:", error);
    }
  };

  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setSelectedName(name);
    setSelectedAddress("");
    if (name) setClientAddresses(clientAddressMap[name] || []);
    else setClientAddresses([]);
  };

  const applyFilters = () => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates.");
      return;
    }

    const from = normalizeDate(fromDate);
    const to = normalizeDate(toDate);

    const result = ledgers.filter((entry) => {
      const entryDate = normalizeDate(entry.date);
      const inDateRange = entryDate >= from && entryDate <= to;

      const matchesName = selectedName
        ? entry.client?.name === selectedName
        : true;

      const matchesAddress = selectedAddress
        ? entry.client?.address === selectedAddress
        : true;

      return inDateRange && matchesName && matchesAddress;
    });

    setFilteredLedgers(result);
  };

  const resetFilters = () => {
    const todayLocal = getLocalDateString();

    setFromDate(todayLocal);
    setToDate(todayLocal);
    setSelectedName("");
    setSelectedAddress("");
    setClientAddresses([]);
    setFilteredLedgers(ledgers);
  };

  const calculateTotals = () => {
    let totalDebit = 0;
    let totalCredit = 0;

    filteredLedgers.forEach((entry) => {
      totalDebit += entry.debit || 0;
      totalCredit += entry.credit || 0;
    });

    return { totalDebit, totalCredit };
  };

  const { totalDebit, totalCredit } = calculateTotals();

  // Download PDF function
  const downloadPDF = () => {
    const element = document.getElementById("ledger-table-section");
    const opt = {
      margin: 0.5,
      filename: `Ledger_${getLocalDateString()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    };
    htm2pdf(element, opt);
  };

  return (
    <div className="ledger-container">
      <h2 className="ledger-heading">Ledger Book</h2>

      {/* Filters */}
      <div className="filter-section">
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

        <div>
          <label>Client Name: </label>
          <select value={selectedName} onChange={handleNameChange}>
            <option value="">All</option>
            {clientNames.map((name, idx) => (
              <option key={idx} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Client Address: </label>
          <select
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            disabled={!selectedName}
          >
            <option value="">All</option>
            {clientAddresses.map((address, idx) => (
              <option key={idx} value={address}>
                {address}
              </option>
            ))}
          </select>
        </div>

        <button onClick={applyFilters} className="filter-button">
          Apply Filters
        </button>
        <button onClick={resetFilters} className="reset-button">
          Reset Filters
        </button>
        <button
          onClick={downloadPDF}
          className="filter-button"
          style={{ backgroundColor: "#2196f3" }}
        >
          Download PDF
        </button>
      </div>

      {/* Totals */}
      <div className="totals-section">
        <p>
          <strong>Total Debit:</strong> PKR {totalDebit}
        </p>
        <p>
          <strong>Total Credit:</strong> PKR {totalCredit}
        </p>
      </div>

      {/* Ledger Table */}
      <div id="ledger-table-section">
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Client Name</th>
              <th>Client Address</th>
              <th>Description</th>
              <th>Debit (DB)</th>
              <th>Credit (CR)</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {filteredLedgers.map((entry, index) => (
              <tr key={index}>
                <td data-label="Date">{formatDate(entry.date)}</td>
                <td data-label="Client Name">{entry.client?.name || "N/A"}</td>
                <td data-label="Client Address">
                  {entry.client?.address || "N/A"}
                </td>
                <td data-label="Description">{entry.description}</td>
                <td data-label="Debit (DB)">
                  {entry.debit ? `PKR ${entry.debit}` : "-"}
                </td>
                <td data-label="Credit (CR)">
                  {entry.credit ? `PKR ${entry.credit}` : "-"}
                </td>
                <td data-label="Balance">{`PKR ${entry.balanceAfter}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LedgerPage;
