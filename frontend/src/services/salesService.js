import axiosInstance from "./axiosInstance";

const SALES_API_URL = "/sales";

export const getAllSales = () => {
  return axiosInstance.get(`${SALES_API_URL}/getallsales`);
};

export const addSale = (saleData) => {
  return axiosInstance.post(`${SALES_API_URL}/addsale`, saleData);
};

export const getSaleById = (id) => {
  return axiosInstance.get(`${SALES_API_URL}/getsale/${id}`);
};

export const deleteSale = (id) => {
  return axiosInstance.delete(`${SALES_API_URL}/deletesale/${id}`);
};
export const updateSaleCost = (id, cost) => {
  return axiosInstance.put(`${SALES_API_URL}/updatecost/${id}`, { cost });
};
