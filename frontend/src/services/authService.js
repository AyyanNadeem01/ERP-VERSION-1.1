// /frontend/src/services/authService.js
import axiosInstance from "./axiosInstance";

export const signup = async (userId, password) => {
  const response = await axiosInstance.post("/auth/signup", { userId, password });
  return response.data;
};

export const login = async (userId, password) => {
  const response = await axiosInstance.post("/auth/login", { userId, password });
  return response.data;
};
