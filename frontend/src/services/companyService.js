// // src/services/companyService.js
// import axiosInstance from "./axiosInstance"; 
// const createCompany = async (data) => {
//   const res = await axiosInstance.post("/company", data);
//   return res.data;
// };

// const getMyCompany = async () => {
//   const res = await axiosInstance.get("/company");
//   return res.data;
// };

// const updateCompany = async (data) => {
//   const res = await axiosInstance.put("/company", data);
//   return res.data;
// };

// const deleteCompany = async () => {
//   const res = await axiosInstance.delete("/company");
//   return res.data;
// };

// const companyService = {
//   createCompany,
//   getMyCompany,
//   updateCompany,
//   deleteCompany,
// };

// export default companyService;


// src/services/companyService.js
import axiosInstance from "./axiosInstance";

const createCompany = async (data) => {
  const res = await axiosInstance.post("/api/company", data);
  return res.data;
};

const getMyCompany = async () => {
  const res = await axiosInstance.get("/api/company");
  return res.data;
};

const updateCompany = async (data) => {
  const res = await axiosInstance.put("/api/company", data);
  return res.data;
};

const deleteCompany = async () => {
  const res = await axiosInstance.delete("/api/company");
  return res.data;
};

const companyService = {
  createCompany,
  getMyCompany,
  updateCompany,
  deleteCompany,
};

export default companyService;
