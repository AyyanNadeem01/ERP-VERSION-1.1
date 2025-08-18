import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/homeDashboard.css";
import { CompanyContext } from "../context/CompanyContext";

const HomeDashboard = () => {
  const navigate = useNavigate();
  const { company, loading } = useContext(CompanyContext);  // ✅ get company data

  const navLinks = [
    { path: "/add-payment", label: "Add Payment" },
    { path: "/vendorledger", label: "Vendors Account Ledgers" },
    { path: "/", label: "Home" },
    { path: "/ledger", label: "Client Account Ledgers" },
    { path: "/manageclientbalances", label: "Outstanding Report Clients" },
    { path: "/additem", label: "Add Item" },
    { path: "/addsale", label: "Add Sale" },
    { path: "/addclient", label: "Add Client" },
    { path: "/Sales", label: "Sales" },
    { path: "/vendors", label: "Manage Vendors" },
    { path: "/signup", label: "Add User" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard-container">
      <motion.h1
        className="welcome-message"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {company
          ? `Welcome to ${company.name} System`
          : "Welcome to ERP System - Please Customize your company info"}
      </motion.h1>

      <div className="card-grid">
        {navLinks.map((link, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link to={link.path} className="nav-card">
              <h2>{link.label}</h2>
            </Link>
          </motion.div>
        ))}

        <motion.div
          className="card-grid"
          key="logout"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: navLinks.length * 0.1 }}
        >
          <button className="nav-card logout-button" onClick={handleLogout}>
            <h2>Logout</h2>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeDashboard;
