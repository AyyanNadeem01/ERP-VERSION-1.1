// import React, { useState, useEffect } from "react";
// import {
//   getVendors,
//   addVendor,
//   updateVendorBalance,
// } from "../services/vendorService";
// import "../styles/vendor.css";

// function Vendors() {
//   const [vendors, setVendors] = useState([]);
//   const [vendorName, setVendorName] = useState("");
//   const [balanceAmount, setBalanceAmount] = useState({});

//   useEffect(() => {
//     fetchVendors();
//   }, []);

//   const fetchVendors = async () => {
//     const res = await getVendors();
//     setVendors(res.data);
//   };

//   const handleAddVendor = async (e) => {
//     e.preventDefault();
//     if (!vendorName) return;

//     await addVendor({
//       name: vendorName,
//       balance: 0, // default balance
//     });

//     setVendorName("");
//     fetchVendors();
//   };

//   const handleBalanceUpdate = async (id, operation) => {
//     const amount = parseFloat(balanceAmount[id]);
//     if (isNaN(amount) || amount <= 0) return;
  
//     const confirmMsg =
//       operation === "increase"
//         ? `Confirm to increase balance by ${amount} for this vendor (Stock Purchased)?`
//         : `Confirm to decrease balance by ${amount} for this vendor (Pay Vendor)?`;
  
//     if (!window.confirm(confirmMsg)) return;
  
//     const finalAmount = operation === "increase" ? amount : -amount;
  
//     await updateVendorBalance(id, finalAmount);
  
//     setBalanceAmount({ ...balanceAmount, [id]: "" });
//     fetchVendors();
//   };
  
//   return (
//     <div className="container">
//       <h1>Vendors</h1>

//       <form onSubmit={handleAddVendor} className="form-section">
//         <input
//           type="text"
//           placeholder="Vendor Name"
//           value={vendorName}
//           onChange={(e) => setVendorName(e.target.value)}
//           style={{ color: "black" }}
//           required
//         />
//         <button className="addvbtn"type="submit">Add Vendor</button>
//       </form>

//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Balance</th>
//             <th>Adjust Balance</th>
//           </tr>
//         </thead>
//         <tbody>
//           {vendors.map((vendor) => (
//             <tr key={vendor._id}>
//               <td>{vendor.name}</td>
//               <td>{vendor.balance.toFixed(2)}</td>
//               <td>
//                 <input
//                   type="number"
//                   placeholder="Amount"
//                   value={balanceAmount[vendor._id] || ""}
//                   onChange={(e) =>
//                     setBalanceAmount({
//                       ...balanceAmount,
//                       [vendor._id]: e.target.value,
//                     })
//                   }
//                   style={{ color: "black" }}
//                 />
//                 <button
//                   onClick={() => handleBalanceUpdate(vendor._id, "increase")}
//                   className="adjust-btn add"
//                   type="button"
//                 >
//                   Stock Purchased
//                 </button>
//                 <button
//                   onClick={() => handleBalanceUpdate(vendor._id, "decrease")}
//                   className="adjust-btn subtract"
//                   type="button"
//                 >
//                   Pay Vendor
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default Vendors;
import React, { useState, useEffect } from "react";
import {
  getVendors,
  addVendor,
  updateVendorBalance,
} from "../services/vendorService";
import "../styles/vendor.css";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [vendorName, setVendorName] = useState("");
  const [initialBalance, setInitialBalance] = useState(""); // New state for initial balance
  const [balanceAmount, setBalanceAmount] = useState({});

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    const res = await getVendors();
    setVendors(res);
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();
    if (!vendorName) return;

    await addVendor({
      name: vendorName,
      balance: parseFloat(initialBalance) || 0, // Send initial balance
    });

    setVendorName("");
    setInitialBalance("");
    fetchVendors();
  };

  const handleBalanceUpdate = async (id, operation) => {
    const amount = parseFloat(balanceAmount[id]);
    if (isNaN(amount) || amount <= 0) return;

    const confirmMsg =
      operation === "increase"
        ? `Confirm to increase balance by ${amount} for this vendor (Stock Purchased)?`
        : `Confirm to decrease balance by ${amount} for this vendor (Pay Vendor)?`;

    if (!window.confirm(confirmMsg)) return;

    const finalAmount = operation === "increase" ? amount : -amount;

    await updateVendorBalance(id, finalAmount);

    setBalanceAmount({ ...balanceAmount, [id]: "" });
    fetchVendors();
  };

  return (
    <div className="container">
      <h1>Vendors</h1>

      <form onSubmit={handleAddVendor} className="form-section">
        <input
          type="text"
          placeholder="Vendor Name"
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
          style={{ color: "black" }}
          required
        />
        <input
          type="number"
          placeholder="Initial Balance"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
          style={{ color: "black" }}
          min="0"
        />
        <button className="addvbtn" type="submit">Add Vendor</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Balance</th>
            <th>Adjust Balance</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor._id}>
              <td>{vendor.name}</td>
              <td>{vendor.balance.toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  placeholder="Amount"
                  value={balanceAmount[vendor._id] || ""}
                  onChange={(e) =>
                    setBalanceAmount({
                      ...balanceAmount,
                      [vendor._id]: e.target.value,
                    })
                  }
                  style={{ color: "black" }}
                />
                <button
                  onClick={() => handleBalanceUpdate(vendor._id, "increase")}
                  className="adjust-btn add"
                  type="button"
                >
                  Stock Purchased
                </button>
                <button
                  onClick={() => handleBalanceUpdate(vendor._id, "decrease")}
                  className="adjust-btn subtract"
                  type="button"
                >
                  Pay Vendor
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Vendors;
