import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import LoginForm from "./components/auth/LoginForm";
import DashboardLayout from "./components/layout/DashboardLayout";
import SaasAdminDashboard from "./components/dashboard/SaasAdminDashboard";
import SuperAdminDashboard from "./components/dashboard/SuperAdminDashboard";
import CustomerDashboard from "./components/customer/CustomerDashboard";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // For SaaS Admin and Super Admin, we need to handle tab changes
  if (user.role === 'saas_admin' || user.role === 'super_admin') {
    return children; // Let the Dashboard component handle its own layout
  }

  return (
    <DashboardLayout user={user}>
      {children}
    </DashboardLayout>
  );
};

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Route to appropriate dashboard based on role
  switch (user.role) {
    case 'saas_admin':
      return <SaasAdminDashboard user={user} />;
    case 'super_admin':
      return <SuperAdminDashboard user={user} />;
    case 'store_manager':
      return <div>Store Manager Dashboard - Coming Soon</div>;
    case 'vendor':
      return <div>Vendor Dashboard - Coming Soon</div>;
    case 'delivery_partner':
      return <div>Delivery Partner Dashboard - Coming Soon</div>;
    case 'customer':
      return <CustomerDashboard user={user} />;
    case 'support_staff':
      return <div>Support Staff Dashboard - Coming Soon</div>;
    default:
      return <div>Invalid Role</div>;
  }
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          {/* Placeholder routes for other sections */}
          <Route path="/tenants" element={
            <ProtectedRoute>
              <div>Tenants Page - Coming Soon</div>
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <div>Analytics Page - Coming Soon</div>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <div>Settings Page - Coming Soon</div>
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;