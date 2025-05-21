import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboard Pages
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";

// Management Pages
import DoctorManagement from "./pages/DoctorManagement";
import PatientManagement from "./pages/PatientManagement";
import AppointmentManagement from "./pages/AppointmentManagement";
import MedicalRecordsManagement from "./pages/MedicalRecordsManagement";
import BillingManagement from "./pages/BillingManagement";
import ReportsManagement from "./pages/ReportsManagement";

// NotFound Page
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Root Path - will redirect based on auth state */}
            <Route path="/" element={<AppLayout />} />
            
            {/* Protected Routes */}
            <Route element={<AppLayout />}>
              {/* Admin Routes */}
              <Route path="/admin-dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* Doctor Routes */}
              <Route path="/doctor-dashboard" element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/my-patients" element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <PatientManagement />
                </ProtectedRoute>
              } />
              
              {/* Patient Routes */}
              <Route path="/patient-dashboard" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientDashboard />
                </ProtectedRoute>
              } />
              <Route path="/book-appointment" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <AppointmentManagement />
                </ProtectedRoute>
              } />
              <Route path="/my-records" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <MedicalRecordsManagement />
                </ProtectedRoute>
              } />
              <Route path="/my-bills" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <BillingManagement />
                </ProtectedRoute>
              } />
              
              {/* Shared Routes */}
              <Route path="/appointments" element={
                <ProtectedRoute allowedRoles={['admin', 'doctor']}>
                  <AppointmentManagement />
                </ProtectedRoute>
              } />
              <Route path="/records" element={
                <ProtectedRoute allowedRoles={['admin', 'doctor']}>
                  <MedicalRecordsManagement />
                </ProtectedRoute>
              } />
              <Route path="/billing" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <BillingManagement />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
