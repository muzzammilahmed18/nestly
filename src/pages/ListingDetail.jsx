import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getListing } from "../api";
import { useAuth } from "../context/AuthContext";
import BookingForm from "../components/BookingForm";

function LoadingState() {
  return (
    <div className="flex flex-col items-center py-32 text-gray-500">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium">Loading this stay...</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center py-32 text-center px-4">
      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xl mb-4">
        !
      </div>
      <p className="text-gray-900 font-bold mb-2">Couldn't load this listing</p>
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

export default function ListingDetail() {
  const { id } = useParams();
  const { isAuthenticated, role } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function load() {
    setLoading(true);
    setError(null);
    getListing(id)
      .then(setListing)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [id]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} onRetry={load} />}
        
        {!loading && !error && listing && (
          <>
            {/* Title & Location Headers (moved above image for standard layout) */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
                {listing.title}
              </h1>
              <p className="text-gray-600 font-medium underline cursor-pointer hover:text-gray-900">
                {listing.location}
              </p>
            </div>

            {/* Immersive Photo Gallery */}
            {listing.photos?.length > 0 ? (
              <div className="w-full h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden rounded-2xl mb-10">
                <img
                  src={listing.photos[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            ) : (
              <div className="w-full h-[40vh] sm:h-[50vh] bg-gray-100 rounded-2xl mb-10 flex items-center justify-center text-6xl">
                🏠
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-12 relative">
              
              {/* Left Column: Description & Details */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center pb-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Hosted by {listing.host?.name || "a verified host"}
                    </h2>
                    <p className="text-gray-500 mt-1">
                      Up to {listing.maxGuests} guests
                    </p>
                  </div>
                  {/* Placeholder for Host Avatar */}
                  <div className="w-14 h-14 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-bold text-xl">
                    {listing.host?.name?.charAt(0) || "H"}
                  </div>
                </div>

                <div className="py-8">
                  <h2 className="font-semibold text-gray-900 mb-4 text-xl">About this place</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                    {listing.description}
                  </p>
                </div>
              </div>

              {/* Right Column: Floating Booking Card */}
              <div className="relative">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] sticky top-28">
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-2xl font-bold text-gray-900">
                      ${listing.pricePerNight}
                    </span>
                    <span className="text-base text-gray-500">night</span>
                  </div>

                  {isAuthenticated && role === "GUEST" && (
                    <BookingForm listing={listing} />
                  )}

                  {isAuthenticated && role === "HOST" && (
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                      <p className="text-sm text-gray-500">
                        Hosts cannot book stays from a Host account.
                      </p>
                    </div>
                  )}

                  {!isAuthenticated && (
                    <Link
                      to="/login"
                      className="block w-full mt-2 bg-orange-700 text-white text-center font-semibold py-3.5 rounded-xl hover:bg-orange-800 transition-all duration-200 shadow-sm active:scale-[0.98]"
                    >
                      Log in to book
                    </Link>
                  )}
                </div>
              </div>
              
            </div>
          </>
        )}
      </main>
    </div>
  );
}