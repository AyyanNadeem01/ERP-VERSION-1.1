import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSaleById } from "../services/salesService";
import { CompanyContext } from "../context/CompanyContext";
import html2pdf from 'html2pdf.js';
import "../styles/saleDetail.css";

function SaleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { company, loading: companyLoading } = useContext(CompanyContext);

  const invoiceRef = useRef(null);

  useEffect(() => {
    getSaleById(id)
      .then((res) => {
        setSale(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load sale details");
        setLoading(false);
      });
  }, [id]);

  if (loading || companyLoading)
    return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!sale) return <div className="error">Sale not found</div>;

  const clientPrevBalance = sale.client?.balance - sale.totalAmount;
  const netClientBalance = sale.client?.balance;
  const emptyRowsCount = 4;
  
  const handleDownloadPdf = () => {
    const element = invoiceRef.current;
    if (element) {
      const opt = {
        margin: [-5, -5, -5, -5],
        filename: `invoice_${sale.invoiceNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
    }
  };

  return (
    <>
      <div className="back-btn-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Sales
        </button>
        <button className="download-btn" onClick={handleDownloadPdf}>
          Download PDF
        </button>
      </div>

      <div className="sale-detail-container" ref={invoiceRef}>
        {/* Header Section */}
        <div className="invoice-header">
          <div className="company-info">
            <div className="company-details">
              <h2>{company?.name || "Your Company Name"}</h2>
              <p>{company?.tagline || "Your Company Tagline"}</p>
              <p>{company?.address || "Your Company Address"}</p>
            </div>
          </div>

          <div className="invoice-meta">
            <h3>INVOICE</h3>
            <p>
              <strong>Invoice #:</strong> {sale.invoiceNumber}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(sale.date).toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>

        {/* Bill To / Client Section */}
        <div className="client-info">
          <h4>Bill To:</h4>
          <p>
            <strong>{sale.client?.name || "N/A"}</strong>
          </p>
          <p>{sale.client?.address || "Address not available"}</p>
        </div>

        {/* Items Table */}
        <table className="items-table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Description</th>
              <th>Rate (Rs.)</th>
              <th>Quantity</th>
              <th>Total (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, index) => (
              <tr key={index}>
                <td>{item.srNo || index + 1}</td>
                <td className="description-col">{item.description}</td>
                <td className="right-align">{item.rate.toFixed(2)}</td>
                <td className="right-align">{item.quantity}</td>
                <td className="right-align">{item.total.toFixed(2)}</td>
              </tr>
            ))}
            {Array.from({ length: emptyRowsCount }).map((_, idx) => (
              <tr key={`empty-${idx}`}>
                <td>&nbsp;</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* New Div for Totals Section */}
        <div className="invoice-totals-section">
          <div className="totals-card">
            <div className="totals-line">
              <span>Subtotal:</span>
              <span>Rs. {sale.totalAmount.toFixed(2)}</span>
            </div>
            <div className="totals-line">
              <span>Previous Balance:</span>
              <span>Rs. {clientPrevBalance.toFixed(2)}</span>
            </div>
            <div className="totals-line net-balance">
              <span>Net Balance:</span>
              <span>Rs. {netClientBalance.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer / Signature */}
        <div className="invoice-footer">
          <div className="authorized-signature">
            <p>Receiving Person Signature</p>
            <div className="signature-line" />
          </div>
          <div className="thank-you">
            <p>Thank you for your business!</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SaleDetailPage;