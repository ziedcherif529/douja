import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Public pages
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import LoginPage from './pages/LoginPage.jsx';

// Client pages
import ClientDashboardPage from './pages/ClientDashboardPage.jsx';
import ClientHorsesPage from './pages/ClientHorsesPage.jsx';
import HorseDetailPage from './pages/HorseDetailPage.jsx';
import ClientInvoicesPage from './pages/ClientInvoicesPage.jsx';

// Admin pages
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminClientsPage from './pages/AdminClientsPage.jsx';
import AdminHorsesPage from './pages/AdminHorsesPage.jsx';
import AdminMedicalPage from './pages/AdminMedicalPage.jsx';
import AdminOperationsPage from './pages/AdminOperationsPage.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx';
import AdminInvoicesPage from './pages/AdminInvoicesPage.jsx';
import CreateInvoicePage from './pages/CreateInvoicePage.jsx';
import ViewInvoicePage from './pages/ViewInvoicePage.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Toaster />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Client routes */}
          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute role="client">
                <ClientDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/horses"
            element={
              <ProtectedRoute role="client">
                <ClientHorsesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/horse/:id"
            element={
              <ProtectedRoute role="client">
                <HorseDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/invoices"
            element={
              <ProtectedRoute role="client">
                <ClientInvoicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/invoices/:id"
            element={
              <ProtectedRoute role="client">
                <ViewInvoicePage />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/clients"
            element={
              <ProtectedRoute role="admin">
                <AdminClientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/horses"
            element={
              <ProtectedRoute role="admin">
                <AdminHorsesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/medical"
            element={
              <ProtectedRoute role="admin">
                <AdminMedicalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/operations"
            element={
              <ProtectedRoute role="admin">
                <AdminOperationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/invoices"
            element={
              <ProtectedRoute role="admin">
                <AdminInvoicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-invoice"
            element={
              <ProtectedRoute role="admin">
                <CreateInvoicePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/invoices/:id"
            element={
              <ProtectedRoute role="admin">
                <ViewInvoicePage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">Page not found</p>
      <a href="/" className="text-primary hover:underline">Go back home</a>
    </div>
  </div>
);

export default App;