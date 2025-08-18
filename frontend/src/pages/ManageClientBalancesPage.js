// import React, { useEffect, useState } from "react";
// import { fetchClients } from "../services/clientService";
// import "../styles/clients.css";

// const ManageClientBalancesPage = () => {
//   const [clients, setClients] = useState([]);

//   const loadClients = async () => {
//     try {
//       const data = await fetchClients();
//       setClients(data);
//     } catch (error) {
//       console.error("Error fetching clients:", error);
//     }
//   };

//   useEffect(() => {
//     loadClients();
//   }, []);

//   // Calculate total outstanding balance
//   const totalOutstanding = clients.reduce(
//     (sum, client) => sum + parseFloat(client.balance),
//     0
//   );

//   return (
//     <div className="fullscreen-wrapper">
//       <header>
//         <h1 className="clc">Clients List</h1>
//       </header>

//       <section className="outstanding-section">
//         <h2 className="totout">Total Outstanding: Rs. {totalOutstanding.toFixed(2)}</h2>
//       </section>

//       <section className="clients-table-section">
//         <table>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Address</th>
//               <th>Balance (Rs.)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {clients.map((client) => (
//               <tr key={client._id}>
//                 <td>{client.name}</td>
//                 <td>{client.address || "None"}</td>
//                 <td>{client.balance}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>
//     </div>
//   );
// };

// export default ManageClientBalancesPage;
import React, { useEffect, useState } from "react"; 
import { fetchClients } from "../services/clientService";
import "../styles/clients.css";
import html2pdf from "html2pdf.js";

const ManageClientBalancesPage = () => {
  const [clients, setClients] = useState([]);

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

  // Calculate total outstanding balance
  const totalOutstanding = clients.reduce(
    (sum, client) => sum + parseFloat(client.balance),
    0
  );

  // Function to download PDF
 const downloadPDF = () => {
  const element = document.getElementById("pdf-content");

  // Save original styles
  const table = element.querySelector("table");
  const tableCells = element.querySelectorAll("table th, table td");

  // Force black text and visible borders
  tableCells.forEach((cell) => {
    cell.style.color = "black";
    cell.style.border = "1px solid black"; // Ensure borders are visible
  });

  table.style.borderCollapse = "collapse"; // Make borders clean

  const options = {
    margin: 0.5,
    filename: `clients_list_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  html2pdf()
    .set(options)
    .from(element)
    .save()
    .then(() => {
      // Restore original styles after PDF is saved
      tableCells.forEach((cell) => {
        cell.style.color = "";
        cell.style.border = "";
      });
      table.style.borderCollapse = "";
    });
};

  return (
    <div className="fullscreen-wrapper">
      <header>
        <h1 className="clc">Clients List</h1>
        <button className="downloadbutton" onClick={downloadPDF} style={{ marginLeft: "20px" }}>
          Download PDF
        </button>
      </header>

      <div id="pdf-content">
        <section className="outstanding-section">
          <h2 className="totout">Total Outstanding: Rs. {totalOutstanding.toFixed(2)}</h2>
        </section>

        <section className="clients-table-section">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Balance (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client._id}>
                  <td>{client.name}</td>
                  <td>{client.address || "None"}</td>
                  <td>{client.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default ManageClientBalancesPage;
