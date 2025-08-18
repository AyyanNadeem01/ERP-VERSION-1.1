import axiosInstance from "./axiosInstance";

const BASE_URL = "/vendorledger";

// Add a ledger entry
export const addLedgerEntry = (entryData) =>
  axiosInstance.post(`${BASE_URL}/add`, entryData);

// Get ledger entries for a specific vendor by ID
export const getVendorLedger = (vendorId) =>
  axiosInstance.get(`${BASE_URL}/${vendorId}`);

// Get all ledger entries (for all vendors)
export const getAllVendorLedgers = () => axiosInstance.get(`${BASE_URL}/`);

// Get filtered ledger entries by vendor ID + date range
export const getFilteredVendorLedgers = ({ vendor, fromDate, toDate }) => {
  const params = {};
  if (vendor) params.vendor = vendor;       // must be `vendor` to match backend
  if (fromDate) params.fromDate = fromDate;
  if (toDate)   params.toDate = toDate;

  return axiosInstance.get(BASE_URL, { params });
};
