import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CompanyProvider } from "./context/CompanyContext"; // ✅ import provider
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Vendors from "./pages/Vendors";
import SalesPage from "./pages/SalesPage";
import SaleDetailPage from "./pages/SaleDetailPage";
import AddSalePage from "./pages/AddSalePage";
import ProtectedRoute from "./components/ProtectedRoute";
import AddClientPage from "./pages/AddClientPage";
import ManageClientBalancesPage from "./pages/ManageClientBalancesPage";
import AddItemPage from "./pages/AddItemPage";
import LedgerPage from "./pages/ledgerPage";
import AddPaymentPage from "./pages/AddPaymentPage";
import VendorLedger from "./pages/VendorLedger";
import HomeDashboard from "./pages/HomeDashboard";
import CompanyPage from "./pages/CompanyPage"
import CollectionPage from "./pages/CollectionPage";

function AppContent() {
  const location = useLocation();
  const hideNavbarOn = ["/login", "/signup"];
  const showNavbar = !hideNavbarOn.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomeDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/vendors"
          element={
            <ProtectedRoute>
              <Vendors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ledger"
          element={
            <ProtectedRoute>
              <LedgerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/additem"
          element={
            <ProtectedRoute>
              <AddItemPage />
            </ProtectedRoute>
          }
        />
       <Route
          path="/getCollections"
          element={
            <ProtectedRoute>
              <CollectionPage />
            </ProtectedRoute>
          }
        />
          <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <SalesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addclient"
          element={
            <ProtectedRoute>
              <AddClientPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manageclientbalances"
          element={
            <ProtectedRoute>
              <ManageClientBalancesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-payment"
          element={
            <ProtectedRoute>
              <AddPaymentPage />
            </ProtectedRoute>
          }
        />
                <Route
          path="/company"
          element={
            <ProtectedRoute>
              <CompanyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendorledger"
          element={
            <ProtectedRoute>
              <VendorLedger />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/:id"
          element={
            <ProtectedRoute>
              <SaleDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addsale"
          element={
            <ProtectedRoute>
              <AddSalePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CompanyProvider>   {/* ✅ wrap with company context */}
        <Router>
          <AppContent />
        </Router>
      </CompanyProvider>
    </AuthProvider>
  );
}

export default App;
