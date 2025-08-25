import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { DeliveryProvider } from "./contexts/DeliveryContext";
import { PickerPackerProvider } from "./contexts/PickerPackerContext";
import { OrderWorkflowProvider } from "./contexts/OrderWorkflowContext";
import Homepage from "./components/Homepage";
import LoginForm from "./components/auth/LoginForm";
import DashboardLayout from "./components/layout/DashboardLayout";
import SaasAdminDashboard from "./components/dashboard/SaasAdminDashboard";
import SuperAdminDashboard from "./components/dashboard/SuperAdminDashboard";
import CustomerDashboard from "./components/customer/CustomerDashboard";
import NKioskDashboard from "./components/customer/NKioskDashboard";
import GroceryPage from "./components/customer/GroceryPage";
import PharmacyPage from "./components/customer/PharmacyPage";
import FoodDeliveryPage from "./components/customer/FoodDeliveryPage";
import ElectronicsPage from "./components/customer/ElectronicsPage";
import OrderHistoryPage from "./components/customer/OrderHistoryPage";
import CartPage from "./components/customer/CartPage";
import StoreManagerDashboard from "./components/storemanager/StoreManagerDashboard";
import VendorDashboard from "./components/vendor/VendorDashboard";
import DeliveryPartnerDashboard from "./components/delivery/DeliveryPartnerDashboard";
import PickerDashboard from "./components/picker/PickerDashboard";
import PackerDashboard from "./components/packer/PackerDashboard";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  console.log('🔒 ProtectedRoute - User from localStorage:', user);
  
  if (!user) {
    console.log('❌ ProtectedRoute - No user found, redirecting to /auth');
    return <Navigate to="/auth" replace />; // Changed from /login to /auth to match your Homepage navigation
  }

  console.log('✅ ProtectedRoute - User found, allowing access');
  
  // For SaaS Admin, Super Admin, and Customer, we need to handle tab changes in their own components
  if (user.role === 'saas_admin' || user.role === 'super_admin' || user.role === 'customer') {
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
  console.log('📊 Dashboard - User from localStorage:', user);
  
  if (!user) {
    console.log('❌ Dashboard - No user found, redirecting to /auth');
    return <Navigate to="/auth" replace />; // Changed from /login to /auth
  }

  console.log('✅ Dashboard - User found, routing to role:', user.role);

  // Route to appropriate dashboard based on role
  switch (user.role) {
    case 'saas_admin':
      console.log('🏢 Routing to SaaS Admin Dashboard');
      return <SaasAdminDashboard user={user} />;
    case 'super_admin':
      console.log('👑 Routing to Super Admin Dashboard');
      return <SuperAdminDashboard user={user} />;
    case 'store_manager':
      console.log('🏪 Routing to Store Manager Dashboard');
      return <StoreManagerDashboard user={user} />;
    case 'vendor':
      console.log('🛒 Routing to Vendor Dashboard');
      return <VendorDashboard user={user} />;
    case 'delivery_partner':
      console.log('🚚 Routing to Delivery Partner Dashboard');
      return <DeliveryPartnerDashboard user={user} />;
    case 'picker':
      console.log('📦 Routing to Picker Dashboard');
      return <PickerDashboard user={user} />;
    case 'packer':
      console.log('📋 Routing to Packer Dashboard');
      return <PackerDashboard user={user} />;
    case 'customer':
      console.log('👤 Routing to Customer Dashboard');
      return <NKioskDashboard user={user} />;
    case 'support_staff':
      console.log('💬 Routing to Support Staff Dashboard');
      return <div>Support Staff Dashboard - Coming Soon</div>;
    default:
      console.log('❌ Invalid role:', user.role);
      return <div>Invalid Role</div>;
  }
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <DeliveryProvider>
          <PickerPackerProvider>
            <div className="App">
              <BrowserRouter>
              <Routes>
                {/* Homepage route - this will be the landing page */}
                <Route path="/" element={<Homepage />} />
              
              {/* Auth routes */}
              <Route path="/auth" element={<LoginForm />} />
              <Route path="/login" element={<Navigate to="/auth" replace />} /> {/* Redirect old login route */}
              
              {/* Dashboard routes */}
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
              
              {/* Customer App Routes */}
              <Route path="/customer-app" element={
                <ProtectedRoute>
                  <NKioskDashboard user={JSON.parse(localStorage.getItem('user') || 'null')} />
                </ProtectedRoute>
              } />
              <Route path="/customer-app/grocery" element={
                <ProtectedRoute>
                  <GroceryPage />
                </ProtectedRoute>
              } />
              <Route path="/customer-app/pharmacy" element={
                <ProtectedRoute>
                  <PharmacyPage />
                </ProtectedRoute>
              } />
              <Route path="/customer-app/food" element={
                <ProtectedRoute>
                  <FoodDeliveryPage />
                </ProtectedRoute>
              } />
              <Route path="/customer-app/electronics" element={
                <ProtectedRoute>
                  <ElectronicsPage />
                </ProtectedRoute>
              } />
              <Route path="/customer-app/orders" element={
                <ProtectedRoute>
                  <OrderHistoryPage />
                </ProtectedRoute>
              } />
              <Route path="/customer-app/cart" element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </div>
      </PickerPackerProvider>
    </DeliveryProvider>
  </CartProvider>
</AuthProvider>
);
}

export default App;