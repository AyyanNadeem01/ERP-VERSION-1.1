import axiosInstance from "./axiosInstance";

const LEDGER_API_URL = "/ledgers";

export const addLedgerEntry = (entryData) => {
  return axiosInstance.post(`${LEDGER_API_URL}/addledger`, entryData);
};

export const getLedgerByClient = (clientId) => {
  return axiosInstance.get(`${LEDGER_API_URL}/client/${clientId}`);
};

export const getAllLedgers = () => {
  return axiosInstance.get(`${LEDGER_API_URL}/getallledgers`);
};
