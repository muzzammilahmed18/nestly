import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getMyBookings, cancelBooking } from "../api";

function LoadingState() {
  return (
    <div className="flex flex-col items-center py-24 text-gray-500">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium">Loading your bookings...</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center py-24 text-center px-4">
      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xl mb-4">
        !
      </div>
      <p className="text-gray-900 font-bold mb-2">Couldn't load your bookings</p>
      <p className="text-gray-500 text-sm mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="bg-gray-900 text-white font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-24 text-gray-500 flex flex-col items-center">
      <div className="text-5xl mb-6">🧳</div>
      <p className="font-bold text-xl text-gray-900 mb-2 tracking-tight">No bookings yet</p>
      <p className="text-sm mb-6 max-w-sm">Time to dust off your bags! Find a beautiful place you'd like to stay and book it.</p>
      <Link
        to="/"
        className="bg-orange-700 text-white text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-orange-800 transition-all duration-200 shadow-sm active:scale-95"
      >
        Start exploring
      </Link>
    </div>
  );
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function MyBookings() {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  function load() {
    setLoading(true);
    setError(null);
    getMyBookings(token)
      .then(setBookings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function handleCancel(id) {
    setCancellingId(id);
    cancelBooking(id, token)
      .then((updated) => {
        setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
        showToast("Booking cancelled.", "success");
      })
      .catch(() => showToast("Couldn't cancel this booking.", "error"))
      .finally(() => setCancellingId(null));
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Trips</h1>
          <p className="text-gray-500 text-lg">Everything you've booked, upcoming and past.</p>
        </div>

        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} onRetry={load} />}
        {!loading && !error && bookings.length === 0 && <EmptyState />}

        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const isCancelled = booking.status === "CANCELLED";
              return (
                <div
                  key={booking.id}
                  className={`bg-white border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 transition-all ${
                    isCancelled ? "border-gray-200 opacity-60 bg-gray-50" : "border-gray-200 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
                  }`}
                >
                  {/* Listing Image */}
                  <div className="w-full sm:w-40 h-48 sm:h-32 shrink-0">
                    {booking.listing.photos?.[0] ? (
                      <img
                        src={booking.listing.photos[0]}
                        alt={booking.listing.title}
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center text-3xl">
                        🏠
                      </div>
                    )}
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">{booking.listing.location}</p>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3">
                        {booking.listing.title}
                      </h3>
                    </div>
                    
                    <div>
                      <span className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-lg">
                        {formatDate(booking.checkIn)} <span className="mx-1 text-gray-400">→</span> {formatDate(booking.checkOut)}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0 mt-2 sm:mt-0 shrink-0">
                    <p className="font-bold text-lg text-gray-900 sm:mb-4">
                      ${booking.totalPrice}
                    </p>
                    
                    {isCancelled ? (
                      <span className="inline-flex items-center text-sm font-bold text-gray-500 uppercase tracking-wide">
                        Cancelled
                      </span>
                    ) : (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="text-sm font-semibold border border-gray-200 text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 hover:border-red-100 transition-colors disabled:opacity-50"
                      >
                        {cancellingId === booking.id ? "Cancelling..." : "Cancel Trip"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}