import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";

// =========================================================
// ADMIN PAGES
// =========================================================

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminTicketDetails from "./pages/admin/AdminTicketDetails";

// =========================================================
// SUPPORT PAGES
// =========================================================

import SupportDashboard from "./pages/support/SupportDashboard";
import MyTickets from "./pages/support/MyTickets";
import CreateTicket from "./pages/support/CreateTicket";
import TicketDetails from "./pages/support/TicketDetails";
import EditTicket from "./pages/support/EditTicket";


function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <Navbar />

        <Routes>

          {/* =====================================================
              PUBLIC ROUTES
          ===================================================== */}

          {/* Root */}
          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

          {/* Login */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* Register */}
          <Route
            path="/register"
            element={<Register />}
          />


          {/* =====================================================
              SUPPORT ROUTES
          ===================================================== */}

          {/* Support Dashboard */}
          <Route
            path="/support"
            element={
              <ProtectedRoute requiredRole="support">
                <SupportDashboard />
              </ProtectedRoute>
            }
          />

          {/* My Tickets */}
          <Route
            path="/support/tickets"
            element={
              <ProtectedRoute requiredRole="support">
                <MyTickets />
              </ProtectedRoute>
            }
          />

          {/* Create Ticket - existing route preserved */}
          <Route
            path="/support/create"
            element={
              <ProtectedRoute requiredRole="support">
                <CreateTicket />
              </ProtectedRoute>
            }
          />

          {/* Additional create-ticket route */}
          <Route
            path="/support/tickets/create"
            element={
              <ProtectedRoute requiredRole="support">
                <CreateTicket />
              </ProtectedRoute>
            }
          />

          {/* Support Ticket Details */}
          <Route
            path="/support/tickets/:id"
            element={
              <ProtectedRoute requiredRole="support">
                <TicketDetails />
              </ProtectedRoute>
            }
          />

          {/* Support Edit Ticket */}
          <Route
            path="/support/tickets/:id/edit"
            element={
              <ProtectedRoute requiredRole="support">
                <EditTicket />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              ADMIN ROUTES
          ===================================================== */}

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Tickets */}
          <Route
            path="/admin/tickets"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminTickets />
              </ProtectedRoute>
            }
          />

          {/* Admin Ticket Details */}
          <Route
            path="/admin/tickets/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminTicketDetails />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              UNKNOWN ROUTES
          ===================================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

        </Routes>

      </AuthProvider>

    </BrowserRouter>
  );
}


export default App;