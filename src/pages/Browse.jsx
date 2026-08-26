import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import SearchFilters from "../components/SearchFilters";
import { getListings } from "../api";

function LoadingState() {
  return (
    <div className="flex flex-col items-center py-24 text-gray-500">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium">Loading stays...</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center py-24 text-center px-4">
      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xl mb-4">
        !
      </div>
      <p className="text-gray-900 font-bold mb-2">Couldn't load listings</p>
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

function EmptyState({ hasFilters }) {
  return (
    <div className="text-center py-24 text-gray-500 flex flex-col items-center">
      <div className="text-5xl mb-6">🏕️</div>
      <p className="font-bold text-xl text-gray-900 mb-2 tracking-tight">
        {hasFilters ? "No stays match your search" : "No stays listed yet"}
      </p>
      <p className="text-sm max-w-sm mx-auto leading-relaxed">
        {hasFilters
          ? "Try a different location, a wider price range, or fewer guests."
          : "Check back soon, or sign up as a host to add the first one."}
      </p>
    </div>
  );
}

export default function Browse() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});

  function load(filters = activeFilters) {
    setLoading(true);
    setError(null);
    getListings(filters)
      .then(setListings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load({});
  }, []);

  function handleSearch(filters) {
    setActiveFilters(filters);
    load(filters);
  }

  const hasFilters = Object.values(activeFilters).some((v) => v);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            Find your next stay
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Browse beautiful places to stay, hosted by real people.
          </p>
        </div>

        <SearchFilters onSearch={handleSearch} />

        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} onRetry={() => load()} />}
        {!loading && !error && listings.length === 0 && <EmptyState hasFilters={hasFilters} />}
        {!loading && !error && listings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10 mt-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}