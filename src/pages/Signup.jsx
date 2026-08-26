import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const { signup, loading, error } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("GUEST");
  const [fieldErrors, setFieldErrors] = useState({});

  function validate() {
    const errors = {};
    if (!name.trim()) errors.name = "Name is required.";

    if (!email.trim()) errors.email = "Email is required.";
    else if (!EMAIL_REGEX.test(email)) errors.email = "Enter a valid email address.";

    if (!password) errors.password = "Password is required.";
    else if (password.length < 8) errors.password = "Password must be at least 8 characters.";

    if (confirmPassword !== password) errors.confirmPassword = "Passwords don't match.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const success = await signup({ name: name.trim(), email: email.trim(), password, role });
    if (success) {
      showToast("Account created — welcome to Nestly!", "success");
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
            Create your account
          </h1>
          <p className="text-gray-500 text-sm">
            Find a beautiful stay, or list your own space.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="signup-name" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Full name
            </label>
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 transition-colors bg-gray-50/50 focus:bg-white"
            />
            {fieldErrors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{fieldErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="signup-email" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 transition-colors bg-gray-50/50 focus:bg-white"
            />
            {fieldErrors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{fieldErrors.email}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="signup-password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 transition-colors bg-gray-50/50 focus:bg-white"
              />
              {fieldErrors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{fieldErrors.password}</p>}
            </div>

            <div>
              <label htmlFor="signup-confirm-password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Confirm
              </label>
              <input
                id="signup-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 transition-colors bg-gray-50/50 focus:bg-white"
              />
              {fieldErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{fieldErrors.confirmPassword}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            How will you use Nestly?
          </label>
          <div className="grid grid-cols-2 gap-3 mb-2">
            <button
              type="button"
              onClick={() => setRole("GUEST")}
              className={`border rounded-xl py-4 flex flex-col items-center justify-center gap-2 text-sm font-medium transition-all duration-200 ${
                role === "GUEST"
                  ? "border-orange-600 bg-orange-50 text-orange-800 ring-1 ring-orange-600"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span className="text-2xl">🧳</span>
              Book stays
            </button>
            <button
              type="button"
              onClick={() => setRole("HOST")}
              className={`border rounded-xl py-4 flex flex-col items-center justify-center gap-2 text-sm font-medium transition-all duration-200 ${
                role === "HOST"
                  ? "border-orange-600 bg-orange-50 text-orange-800 ring-1 ring-orange-600"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span className="text-2xl">🏠</span>
              Host a place
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3 h-4">
            {role === "GUEST"
              ? "You'll be able to search and book amazing listings."
              : "You'll be able to list your space and manage bookings."}
          </p>
        </div>

        {error && (
          <div className="mt-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-700 text-white font-semibold py-3.5 rounded-xl hover:bg-orange-800 disabled:opacity-70 transition-all duration-200 active:scale-[0.98] mt-8 shadow-sm"
        >
          {loading ? "Creating account..." : "Agree and continue"}
        </button>

        <p className="text-sm text-gray-500 mt-8 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-700 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}