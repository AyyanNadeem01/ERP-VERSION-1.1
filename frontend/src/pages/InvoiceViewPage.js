import React from "react";
import "../styles/invoiceView.css";

function InvoiceViewPage({ invoiceData }) {
  if (!invoiceData) return <p>No Invoice Data Available</p>;

  const {
    invoiceNumber,
    clientName,
    date,
    items,
    totalAmount,
    clientBalanceBefore,
  } = invoiceData;

  const newBalance = (clientBalanceBefore + totalAmount).toFixed(2);

  return (
    <div className="invoice-view-container">
      <div className="invoice-header">
        <h2>Invoice</h2>
        <div className="invoice-info">
          <p><strong>Invoice No:</strong> {invoiceNumber}</p>
          <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
          <p><strong>Client:</strong> {clientName}</p>
        </div>
      </div>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Description</th>
            <th>Rate ($)</th>
            <th>Quantity</th>
            <th>Total ($)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.srNo}</td>
              <td>{item.description}</td>
              <td>Rs.{item.rate.toFixed(2)}</td>
              <td>{item.quantity}</td>
              <td>Rs.{item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="invoice-summary">
        <h3>Invoice Total: Rs.{totalAmount.toFixed(2)}</h3>
        <p><strong>Previous Balance:</strong> Rs.{clientBalanceBefore.toFixed(2)}</p>
        <p><strong>New Balance:</strong> Rs.{newBalance}</p>
      </div>

      <div className="footer-note">
        <p>Thank you for your business!</p>
      </div>
    </div>
  );
}

export default InvoiceViewPage;
