import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Browse from "./pages/Browse";
import ListingDetail from "./pages/ListingDetail";
import HostDashboard from "./pages/HostDashboard";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Browse />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route
              path="/host"
              element={
                <ProtectedRoute allowedRoles={["HOST"]}>
                  <HostDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;