import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 group" 
          onClick={() => setMenuOpen(false)}
        >
          <span className="text-3xl transition-transform group-hover:scale-110">🏡</span>
          <span className="text-2xl font-bold text-orange-700 tracking-tight">Nestly</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              {user?.role === "HOST" && (
                <Link to="/host" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Host dashboard
                </Link>
              )}
              {user?.role === "ADMIN" && (
                <Link to="/admin" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Admin
                </Link>
              )}
              <Link to="/bookings" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                My bookings
              </Link>
              
              <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                <button 
                  onClick={logout} 
                  className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                >
                  Log out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Log in
              </Link>
              <Link 
                to="/signup" 
                className="bg-orange-700 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-orange-800 transition-all duration-200 shadow-sm hover:shadow active:scale-95"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="sm:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          aria-label="Toggle menu"
        >
          <span className="text-2xl leading-none">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-5 flex flex-col gap-4 shadow-md">
          {isAuthenticated ? (
            <>
              <div className="pb-3 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-900">Hi, {user?.name}</span>
              </div>
              
              {user?.role === "HOST" && (
                <Link to="/host" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-600 hover:text-orange-700 transition-colors">
                  Host dashboard
                </Link>
              )}
              {user?.role === "ADMIN" && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-600 hover:text-orange-700 transition-colors">
                  Admin
                </Link>
              )}
              <Link to="/bookings" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-600 hover:text-orange-700 transition-colors">
                My bookings
              </Link>
              
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="text-sm font-medium text-red-500 hover:text-red-700 text-left pt-3 border-t border-gray-100 mt-2 transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-base font-medium text-gray-600 hover:text-orange-700 py-2 transition-colors">
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="bg-orange-700 text-white text-base font-semibold px-4 py-3.5 rounded-full text-center hover:bg-orange-800 transition-colors mt-2 shadow-sm"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}