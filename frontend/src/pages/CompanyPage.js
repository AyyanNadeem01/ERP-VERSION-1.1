import React, { useContext, useState, useEffect } from "react";
import { CompanyContext } from "../context/CompanyContext";
import "../styles/CompanyPage.css"; // import custom css

const CompanyPage = () => {
  const { company, createCompany, updateCompany, loading } = useContext(CompanyContext);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    tagline: "",
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        address: company.address || "",
        tagline: company.tagline || "",
      });
    }
  }, [company]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (company) {
      updateCompany(formData);
    } else {
      createCompany(formData);
    }
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="company-page">
      <div className="company-card">
        <h2>{company ? "Update Company Profile" : "Create Company Profile"}</h2>

        <form onSubmit={handleSubmit}>
          <label>Company Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter company name"
            value={formData.name}
            onChange={handleChange}
          />

          <label>Company Address</label>
          <input
            type="text"
            name="address"
            placeholder="Enter address"
            value={formData.address}
            onChange={handleChange}
          />

          <label>Tagline</label>
          <input
            type="text"
            name="tagline"
            placeholder="Enter tagline"
            value={formData.tagline}
            onChange={handleChange}
          />

          <button type="submit">
            {company ? "Update Company" : "Create Company"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyPage;
