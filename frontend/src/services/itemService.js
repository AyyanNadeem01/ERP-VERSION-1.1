import axiosInstance from "./axiosInstance";  // your configured instance

const API_URL = "/items";  // base endpoint

// Get all items
export const getItems = async () => {
  const response = await axiosInstance.get(`${API_URL}/`);
  return response.data;
};

// Add a new item
export const addItem = async ({ itemName, stock, costPrice }) => {
  const response = await axiosInstance.post(`${API_URL}/add`, {
    itemName,
    stock,
    costPrice,
  });
  return response.data;
};

// Delete an item by ID
export const deleteItem = async (id) => {
  const response = await axiosInstance.delete(`${API_URL}/delete/${id}`);
  return response.data;
};

// Update an item by ID
export const updateItem = async (id, { stock, costPrice }) => {
  const response = await axiosInstance.put(`${API_URL}/update/${id}`, {
    stock,
    costPrice,
  });
  return response.data;
};
