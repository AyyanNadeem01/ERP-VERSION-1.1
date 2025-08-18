// src/context/CompanyContext.js
import React, { createContext, useState, useEffect } from "react";
import companyService from "../services/companyService";

export const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch company on load
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await companyService.getMyCompany();
        setCompany(data);
      } catch (err) {
        console.log("No company found, user can create one.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  // Actions
  const createCompany = async (data) => {
    const newCompany = await companyService.createCompany(data);
    setCompany(newCompany);
  };

  const updateCompany = async (data) => {
    const updated = await companyService.updateCompany(data);
    setCompany(updated);
  };

  const deleteCompany = async () => {
    await companyService.deleteCompany();
    setCompany(null);
  };

  return (
    <CompanyContext.Provider
      value={{ company, loading, createCompany, updateCompany, deleteCompany }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
