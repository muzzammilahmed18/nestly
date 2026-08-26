import { createContext, useContext, useState } from "react";
import { loginRequest, signupRequest } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function saveSession(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }

  async function login(credentials) {
    setLoading(true);
    setError(null);
    try {
      const data = await loginRequest(credentials);
      saveSession(data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function signup(details) {
    setLoading(true);
    setError(null);
    try {
      const data = await signupRequest(details);
      saveSession(data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user, // { id, name, email, role }
        role: user?.role,
        isAuthenticated: !!token,
        login,
        signup,
        logout,
        error,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}