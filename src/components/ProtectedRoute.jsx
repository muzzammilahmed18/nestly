import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wraps any page that should only be visible to logged-in users.
// Optionally pass allowedRoles to also restrict by role, e.g.
// <ProtectedRoute allowedRoles={["HOST"]}> for a host-only page.
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}