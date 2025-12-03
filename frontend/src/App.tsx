import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { PricingPage } from './pages/PricingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterTenantPage } from './pages/RegisterTenantPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

// Dashboards
import { SuperAdminDashboard } from './pages/dashboards/SuperAdminDashboard';
import { TenantAdminDashboard } from './pages/dashboards/TenantAdminDashboard';
import { HRDashboard } from './pages/dashboards/HRDashboard';
import { ManagerDashboard } from './pages/dashboards/ManagerDashboard';
import { EmployeeDashboard } from './pages/dashboards/EmployeeDashboard';

// Other Pages
import { MePage } from './pages/MePage';
import { EmployeesPage } from './pages/EmployeesPage';
import { GenericPage } from './pages/GenericPage';

const DashboardRouter = () => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Log when user data is available
    if (user) {
      console.log('DashboardRouter: User authenticated', { userId: user.id, role: user.role });
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const primaryRole = user.role || 'Employee';

  if (primaryRole === 'Super Admin') {
    return <SuperAdminDashboard />;
  }

  if (primaryRole === 'Tenant Admin') {
    return <TenantAdminDashboard />;
  }

  if (primaryRole === 'HR') {
    return <HRDashboard />;
  }

  if (primaryRole === 'Manager') {
    return <ManagerDashboard />;
  }

  return <EmployeeDashboard />;
};

function App() {
  return (
    <ChakraProvider>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterTenantPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />

            {/* ME Section */}
            <Route
              path="/me"
              element={
                <ProtectedRoute>
                  <MePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/me/profile"
              element={
                <ProtectedRoute>
                  <GenericPage title="My Profile" />
                </ProtectedRoute>
              }
            />

            {/* Tenant Admin Pages */}
            <Route
              path="/departments"
              element={
                <ProtectedRoute requiredRole="Tenant Admin">
                  <GenericPage title="Departments" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/designations"
              element={
                <ProtectedRoute requiredRole="Tenant Admin">
                  <GenericPage title="Designations" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/policies"
              element={
                <ProtectedRoute requiredRole="Tenant Admin">
                  <GenericPage title="Leave Policies" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shifts"
              element={
                <ProtectedRoute requiredRole="Tenant Admin">
                  <GenericPage title="Shifts" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles"
              element={
                <ProtectedRoute requiredRole="Tenant Admin">
                  <GenericPage title="Roles & Permissions" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <GenericPage title="Settings" />
                </ProtectedRoute>
              }
            />

            {/* Employee/HR Pages */}
            <Route
              path="/employees"
              element={
                <ProtectedRoute>
                  <EmployeesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <GenericPage title="Attendance" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaves"
              element={
                <ProtectedRoute>
                  <GenericPage title="Leaves" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payroll"
              element={
                <ProtectedRoute>
                  <GenericPage title="Payroll" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/approvals"
              element={
                <ProtectedRoute>
                  <GenericPage title="Approvals" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <GenericPage title="Profile" />
                </ProtectedRoute>
              }
            />

            {/* Manager Pages */}
            <Route
              path="/team"
              element={
                <ProtectedRoute requiredRole="Manager">
                  <GenericPage title="My Team" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team-attendance"
              element={
                <ProtectedRoute requiredRole="Manager">
                  <GenericPage title="Team Attendance" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team-leaves"
              element={
                <ProtectedRoute requiredRole="Manager">
                  <GenericPage title="Team Leaves" />
                </ProtectedRoute>
              }
            />

            {/* Super Admin Pages */}
            <Route
              path="/tenants"
              element={
                <ProtectedRoute requiredRole="Super Admin">
                  <GenericPage title="Tenants" />
                </ProtectedRoute>
              }
            />

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
