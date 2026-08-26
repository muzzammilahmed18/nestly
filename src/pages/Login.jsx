import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { login, loading, error } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  function validate() {
    const errors = {};
    if (!email.trim()) errors.email = "Email is required.";
    if (!password) errors.password = "Password is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const success = await login({ email: email.trim(), password });
    if (success) {
      showToast("Welcome back!", "success");
      navigate("/");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 w-full max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
      >
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
            Welcome back to Nestly
          </h1>
          <p className="text-gray-500 text-sm">
            Enter your details to access your account.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="login-email" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 transition-colors bg-gray-50/50 focus:bg-white"
            />
            {fieldErrors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{fieldErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 transition-colors bg-gray-50/50 focus:bg-white"
            />
            {fieldErrors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{fieldErrors.password}</p>}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-700 text-white font-semibold py-3.5 rounded-xl hover:bg-orange-800 disabled:opacity-70 transition-all duration-200 active:scale-[0.98] mt-8 shadow-sm"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="text-sm text-gray-500 mt-8 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-orange-700 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
}