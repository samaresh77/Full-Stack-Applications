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

import SupportDashboard from "./pages/support/SupportDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

import CreateTicket from "./pages/support/CreateTicket";
import TicketDetails from "./pages/support/TicketDetails";
import EditTicket from "./pages/support/EditTicket";

import AdminTickets from "./pages/admin/AdminTickets";
import AdminTicketDetails from "./pages/admin/AdminTicketDetails";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>

          <Route
            path="/login"
            element={<Login />}
          />
          
          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/support"
            element={
              <ProtectedRoute requiredRole="support">
                <SupportDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/support/create"
            element={
              <ProtectedRoute requiredRole="support">
                <CreateTicket />
              </ProtectedRoute>
            }
          />

          <Route
            path="/support/tickets/:id"
            element={
              <ProtectedRoute requiredRole="support">
                <TicketDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/support/tickets/:id/edit"
            element={
              <ProtectedRoute requiredRole="support">
                <EditTicket />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute
                requiredRole="admin"
              >
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/tickets"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminTickets />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/tickets/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminTicketDetails />
              </ProtectedRoute>
            }
          />

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