import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function ProtectedRoute({
  children,
  requiredRole,
}) {
  const {
    user,
    loading,
  } = useAuth();


  // =========================================================
  // AUTHENTICATION LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>

        <p>
          Loading...
        </p>
      </div>
    );
  }


  // =========================================================
  // USER NOT LOGGED IN
  // =========================================================

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // =========================================================
  // ROLE PROTECTION
  // =========================================================

  if (
    requiredRole &&
    user.role !== requiredRole
  ) {

    // Admin trying to access Support
    if (user.role === "admin") {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }


    // Support trying to access Admin
    if (user.role === "support") {
      return (
        <Navigate
          to="/support"
          replace
        />
      );
    }


    // Unknown role
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // =========================================================
  // AUTHORIZED
  // =========================================================

  return children;
}


export default ProtectedRoute;