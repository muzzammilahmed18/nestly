import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import ListingForm from "../components/ListingForm";
import HostCharts from "../components/HostCharts";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getMyListings, createListing, updateListing, deleteListing, getHostBookings } from "../api";

function StatCard({ label, value }) {
  return (
    <div className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 rounded-2xl p-5 sm:p-6 flex flex-col justify-center transition-transform hover:-translate-y-1 duration-300">
      <p className="text-xs sm:text-sm font-bold text-gray-500 mb-1 sm:mb-2 uppercase tracking-wider">{label}</p>
      <p className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{value}</p>
    </div>
  );
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function HostDashboard() {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverFieldErrors, setServerFieldErrors] = useState({});
  const [editingListing, setEditingListing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);

  function loadListings() {
    setLoadingListings(true);
    getMyListings(token).then(setListings).finally(() => setLoadingListings(false));
  }

  function loadBookings() {
    setLoadingBookings(true);
    setBookingsError(null);
    getHostBookings(token)
      .then(setBookings)
      .catch((err) => setBookingsError(err.message))
      .finally(() => setLoadingBookings(false));
  }

  useEffect(() => {
    loadListings();
    loadBookings();
  }, []);

  const stats = useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === "CONFIRMED");
    const revenue = confirmed.reduce((sum, b) => sum + b.totalPrice, 0);
    const upcoming = confirmed.filter((b) => new Date(b.checkIn) >= new Date()).length;
    return {
      totalListings: listings.length,
      totalBookings: confirmed.length,
      upcoming,
      revenue,
    };
  }, [bookings, listings]);

  function handleSubmit(form, resetForm) {
    setSubmitting(true);
    setServerFieldErrors({});
    const action = editingListing
      ? updateListing(editingListing.id, form, token)
      : createListing(form, token);

    action
      .then((saved) => {
        if (editingListing) {
          setListings((prev) => prev.map((l) => (l.id === saved.id ? saved : l)));
          setEditingListing(null);
        } else {
          setListings((prev) => [saved, ...prev]);
          resetForm();
        }
        showToast("Listing saved.", "success");
      })
      .catch((err) => {
        if (err.fieldErrors) setServerFieldErrors(err.fieldErrors);
        showToast(err.message || "Something went wrong.", "error");
      })
      .finally(() => setSubmitting(false));
  }

  function handleDelete(id) {
    setDeletingId(id);
    deleteListing(id, token)
      .then(() => {
        setListings((prev) => prev.filter((l) => l.id !== id));
        showToast("Listing deleted.", "success");
      })
      .catch(() => showToast("Couldn't delete that listing.", "error"))
      .finally(() => setDeletingId(null));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Host Dashboard</h1>
          <p className="text-gray-500 text-lg">Manage your listings and see how they're doing.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <StatCard label="Listings" value={stats.totalListings} />
          <StatCard label="Bookings" value={stats.totalBookings} />
          <StatCard label="Upcoming" value={stats.upcoming} />
          <StatCard label="Revenue" value={`$${stats.revenue}`} />
        </div>

        {!loadingBookings && !bookingsError && (
          <div className="mb-12">
            <HostCharts bookings={bookings} />
          </div>
        )}

        <div className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 rounded-2xl p-6 sm:p-8 mb-12">
          <ListingForm
            editingListing={editingListing}
            onSubmit={handleSubmit}
            onCancelEdit={() => setEditingListing(null)}
            submitting={submitting}
            serverFieldErrors={serverFieldErrors}
          />
        </div>

        {/* Listings Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Your listings</h2>
          
          {loadingListings && (
            <div className="flex items-center gap-3 text-gray-500 text-sm py-6">
              <div className="w-5 h-5 border-2 border-gray-200 border-t-orange-600 rounded-full animate-spin" />
              <span className="font-medium">Loading listings...</span>
            </div>
          )}
          
          {!loadingListings && listings.length === 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
              <p className="text-gray-500 font-medium">You haven't listed anything yet.</p>
            </div>
          )}
          
          {!loadingListings && listings.length > 0 && (
            <div className="space-y-4">
              {listings.map((listing) => (
                <div key={listing.id} className="bg-white shadow-sm border border-gray-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all hover:shadow-md">
                  {listing.photos?.[0] ? (
                    <img src={listing.photos[0]} alt={listing.title} className="w-full sm:w-20 h-40 sm:h-20 rounded-xl object-cover shrink-0" />
                  ) : (
                    <div className="w-full sm:w-20 h-40 sm:h-20 rounded-xl bg-gray-100 flex items-center justify-center text-3xl shrink-0">🏠</div>
                  )}
                  
                  <div className="flex-1 w-full">
                    <p className="font-bold text-gray-900 text-lg mb-1">{listing.title}</p>
                    <p className="text-sm font-medium text-gray-500">
                      {listing.location} <span className="mx-1 text-gray-300">•</span> ${listing.pricePerNight}/night <span className="mx-1 text-gray-300">•</span> up to {listing.maxGuests} guests
                    </p>
                  </div>
                  
                  <div className="flex gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                    <button
                      onClick={() => setEditingListing(listing)}
                      className="flex-1 sm:flex-none text-sm font-semibold border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      disabled={deletingId === listing.id}
                      className="flex-1 sm:flex-none text-sm font-semibold border border-gray-200 text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 hover:border-red-100 transition-colors disabled:opacity-50"
                    >
                      {deletingId === listing.id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookings Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Recent Bookings</h2>
          
          {loadingBookings && (
            <div className="flex items-center gap-3 text-gray-500 text-sm py-6">
              <div className="w-5 h-5 border-2 border-gray-200 border-t-orange-600 rounded-full animate-spin" />
              <span className="font-medium">Loading bookings...</span>
            </div>
          )}
          
          {!loadingBookings && bookingsError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium">
              {bookingsError}
            </div>
          )}
          
          {!loadingBookings && !bookingsError && bookings.length === 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
              <p className="text-gray-500 font-medium">No bookings yet across your listings.</p>
            </div>
          )}
          
          {!loadingBookings && !bookingsError && bookings.length > 0 && (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`bg-white shadow-sm border rounded-2xl p-5 transition-all ${
                    booking.status === "CANCELLED" ? "opacity-60 border-gray-200 bg-gray-50" : "border-gray-100 hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-gray-900 text-lg mb-1">{booking.listing.title}</p>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Guest: <span className="text-gray-900">{booking.guest.name}</span> <span className="text-gray-400">({booking.guest.email})</span>
                      </p>
                      <p className="text-sm font-medium text-gray-500">
  {formatDate(booking.checkIn)} <span className="mx-1 text-gray-300">→</span> {formatDate(booking.checkOut)}
</p>
                    </div>
                    
                    <div className="text-left sm:text-right border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0">
                      <p className="font-extrabold text-xl text-gray-900 mb-2">${booking.totalPrice}</p>
                      <span
                        className={`inline-block text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${
                          booking.status === "CANCELLED"
                            ? "bg-gray-200 text-gray-600"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}