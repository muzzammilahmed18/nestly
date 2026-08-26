import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getAdminStats, getAdminUsers, getAdminListings, adminDeleteListing } from "../api";

function StatCard({ label, value }) {
  return (
    <div className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 rounded-2xl p-5 sm:p-6 flex flex-col justify-center transition-transform hover:-translate-y-1 duration-300">
      <p className="text-xs sm:text-sm font-bold text-gray-500 mb-1 sm:mb-2 uppercase tracking-wider">{label}</p>
      <p className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  function loadAll() {
    setLoading(true);
    Promise.all([getAdminStats(token), getAdminUsers(token), getAdminListings(token)])
      .then(([statsData, usersData, listingsData]) => {
        setStats(statsData);
        setUsers(usersData);
        setListings(listingsData);
      })
      .catch(() => showToast("Couldn't load admin data.", "error"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAll();
  }, []);

  function handleDeleteListing(id) {
    setDeletingId(id);
    adminDeleteListing(id, token)
      .then(() => {
        setListings((prev) => prev.filter((l) => l.id !== id));
        showToast("Listing removed.", "success");
      })
      .catch(() => showToast("Couldn't remove that listing.", "error"))
      .finally(() => setDeletingId(null));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center py-32 text-gray-500">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 text-lg">Platform-wide overview and moderation.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <StatCard label="Users" value={stats.userCount} />
          <StatCard label="Listings" value={stats.listingCount} />
          <StatCard label="Bookings" value={stats.bookingCount} />
          <StatCard label="Revenue" value={`$${stats.totalRevenue}`} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">All listings</h2>
        <div className="space-y-4 mb-12">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white shadow-sm border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <p className="font-bold text-gray-900 text-lg mb-1">{listing.title}</p>
                <p className="text-sm font-medium text-gray-500">
                  {listing.location} <span className="mx-1 text-gray-300">•</span> hosted by <span className="text-gray-700">{listing.host.name}</span> <span className="text-gray-400">({listing.host.email})</span>
                </p>
              </div>
              <button
                onClick={() => handleDeleteListing(listing.id)}
                disabled={deletingId === listing.id}
                className="text-sm font-semibold border border-gray-200 text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 hover:border-red-100 transition-colors disabled:opacity-50 self-start sm:self-auto shrink-0"
              >
                {deletingId === listing.id ? "Removing..." : "Remove"}
              </button>
            </div>
          ))}
          {listings.length === 0 && (
             <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
                <p className="text-gray-500 font-medium">No listings on the platform yet.</p>
             </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">All users</h2>
        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden overflow-x-auto mb-12">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="p-4 sm:px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Name</th>
                <th className="p-4 sm:px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Email</th>
                <th className="p-4 sm:px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 sm:px-6 py-4 text-gray-900 font-medium whitespace-nowrap">{u.name}</td>
                  <td className="p-4 sm:px-6 py-4 text-gray-500 whitespace-nowrap">{u.email}</td>
                  <td className="p-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                      ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 
                        u.role === 'HOST' ? 'bg-orange-100 text-orange-700' : 
                        'bg-gray-100 text-gray-600'}`
                    }>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}