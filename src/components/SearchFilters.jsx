import { useState } from "react";

// Purely local UI state — filters don't need to be global/shared,
// only the Browse page that renders this cares about their values.
export default function SearchFilters({ onSearch }) {
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [guests, setGuests] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSearch({ location, minPrice, maxPrice, guests });
  }

  function handleClear() {
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setGuests("");
    onSearch({});
  }

  return (
    <div className="w-full flex justify-center mb-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-2xl lg:rounded-full p-4 lg:p-2 shadow-[0_8px_30px_rgb(0,0,0,0.06)] w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-0 lg:items-center divide-y lg:divide-y-0 lg:divide-x divide-gray-200"
      >
        
        {/* Location */}
        <div className="lg:col-span-4 px-2 lg:px-6">
          <label htmlFor="filter-location" className="block text-xs font-bold text-gray-800 mb-0.5 tracking-wide uppercase">
            Where
          </label>
          <input
            id="filter-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search destinations"
            className="w-full bg-transparent text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-0 p-0 border-0"
          />
        </div>

        {/* Pricing (Combined visually on desktop) */}
        <div className="lg:col-span-4 px-2 lg:px-6 pt-3 lg:pt-0 flex gap-4">
          <div className="flex-1">
            <label htmlFor="filter-min-price" className="block text-xs font-bold text-gray-800 mb-0.5 tracking-wide uppercase">
              Min Price
            </label>
            <input
              id="filter-min-price"
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="$0"
              className="w-full bg-transparent text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-0 p-0 border-0"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="filter-max-price" className="block text-xs font-bold text-gray-800 mb-0.5 tracking-wide uppercase">
              Max Price
            </label>
            <input
              id="filter-max-price"
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Any"
              className="w-full bg-transparent text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-0 p-0 border-0"
            />
          </div>
        </div>

        {/* Guests & Actions */}
        <div className="lg:col-span-4 px-2 lg:pl-6 lg:pr-2 pt-3 lg:pt-0 flex items-center justify-between gap-4">
          <div className="flex-1">
            <label htmlFor="filter-guests" className="block text-xs font-bold text-gray-800 mb-0.5 tracking-wide uppercase">
              Who
            </label>
            <input
              id="filter-guests"
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              placeholder="Add guests"
              className="w-full bg-transparent text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-0 p-0 border-0"
            />
          </div>
          
          <div className="flex items-center gap-2">
            {(location || minPrice || maxPrice || guests) && (
              <button
                type="button"
                onClick={handleClear}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors shrink-0"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="bg-orange-700 text-white p-3 lg:px-6 lg:py-3 rounded-full hover:bg-orange-800 transition-colors shadow-sm shrink-0 flex items-center justify-center"
            >
              <span className="hidden lg:inline font-semibold">Search</span>
              <svg className="w-5 h-5 lg:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}