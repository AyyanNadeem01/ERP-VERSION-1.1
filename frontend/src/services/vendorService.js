import axiosInstance from "./axiosInstance"; // your configured instance

const API_URL = "/vendors"; // base endpoint

// Get all vendors
export const getVendors = async () => {
  const response = await axiosInstance.get(`${API_URL}/getvendors`);
  return response.data;
};

// Add a new vendor
export const addVendor = async ({ name, contact, balance }) => {
  const response = await axiosInstance.post(`${API_URL}/addvendor`, {
    name,
    contact,
    balance,
  });
  return response.data;
};

// Update a vendor's balance by ID
export const updateVendorBalance = async (id, amount) => {
  const response = await axiosInstance.put(`${API_URL}/vendor/${id}/balance`, {
    amount,
  });
  return response.data;
};

// Delete a vendor by ID (optional, if you want similar to items)
export const deleteVendor = async (id) => {
  const response = await axiosInstance.delete(`${API_URL}/vendor/${id}/delete`);
  return response.data;
};
