import axiosInstance from "./axiosInstance"; // import your configured instance

export const fetchClients = async () => {

  const response = await axiosInstance.get("/clients/getclients");
  return response.data;
};

export const createClient = async (clientData) => {
  const response = await axiosInstance.post("/clients/addclient", clientData);
  return response.data;
};

export const updateClientBalance = async (id, amount, remarks) => {
  const response = await axiosInstance.put(`clients/client/${id}/balance`, { amount, remarks });
  return response.data;
};
