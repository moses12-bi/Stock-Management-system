import React from "react";
import "./App.css";
import SideNav from "./Components/SideNav/SideNav";
import ProductTable from "./Components/ProductTable/ProductTable";
import SupplierTable from "./Components/SupplierTable/SupplierTable";
import OrderTable from "./Components/OrderTable/OrderTable";
import NavBar from "./Components/NavBar/NavBar";
import CategoryPage from "./Pages/CategoryPage/CategoryPage";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/useAuth";
import DashboardPage from './Pages/DashboardPage/DashboardPage';
import { ToastProvider } from "./contexts/ToastContext";
import Login from './Pages/LoginPage/LoginPage';
import Register from './Pages/RegisterPage/RegisterPage';
import TwoFactorAuthPage from './Pages/TwoFactorAuthPage/TwoFactorAuthPage';
import PrivateRoute from './Pages/PrivateRoute/PrivateRoute';
import { Toaster } from 'react-hot-toast';

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-2xl">Loading...</div>
    </div>;
  }

  return (
    <div className="App">
      <div className="h-full">
        <div className="bg-sky-100 min-h-lvh">
          <NavBar />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-2fa" element={<TwoFactorAuthPage />} />

            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={
                <div className="flex">
                  <SideNav />
                  <main className="flex-1 p-4">
                    <Toaster position="top-right" />
                    <DashboardPage />
                  </main>
                </div>
              } />
              <Route path="/products" element={
                <div className="flex">
                  <SideNav />
                  <main className="flex-1 p-4">
                    <Toaster position="top-right" />
                    <ProductTable />
                  </main>
                </div>
              } />
              <Route path="/categories" element={
                <div className="flex">
                  <SideNav />
                  <main className="flex-1 p-4">
                    <Toaster position="top-right" />
                    <CategoryPage />
                  </main>
                </div>
              } />
              <Route path="/suppliers" element={
                <div className="flex">
                  <SideNav />
                  <main className="flex-1 p-4">
                    <Toaster position="top-right" />
                    <SupplierTable />
                  </main>
                </div>
              } />
              <Route path="/orders" element={
                <div className="flex">
                  <SideNav />
                  <main className="flex-1 p-4">
                    <Toaster position="top-right" />
                    <OrderTable />
                  </main>
                </div>
              } />
              <Route path="*" element={
                <div className="flex">
                  <SideNav />
                  <main className="flex-1 p-4">
                    <Toaster position="top-right" />
                    <Navigate to="/dashboard" replace />
                  </main>
                </div>
              } />
            </Route>

            {/* Catch-all route for unauthenticated users */}
            <Route path="*" element={
              <main className="flex-1">
                <Toaster position="top-right" />
                <Navigate to="/login" replace />
              </main>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
