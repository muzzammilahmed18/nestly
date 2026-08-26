import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function todayISODate() {
  return new Date().toISOString().split("T")[0];
}

export default function BookingForm({ listing }) {
  const { token } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  const totalPrice = nights * listing.pricePerNight;

  function validate() {
    const next = {};
    if (!checkIn) next.checkIn = "Choose a check-in date.";
    if (!checkOut) next.checkOut = "Choose a check-out date.";
    if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
      next.checkOut = "Check-out must be after check-in.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});

    createBooking({ listingId: listing.id, checkIn, checkOut }, token)
      .then(() => {
        showToast("Booking confirmed!", "success");
        navigate("/bookings");
      })
      .catch((err) => {
        if (err.fieldErrors) {
          setErrors(err.fieldErrors);
        } else if (err.status === 409) {
          setErrors({ checkIn: err.message });
        }
        showToast(err.message || "Couldn't complete this booking.", "error");
      })
      .finally(() => setSubmitting(false));
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      {/* FIXED: Changed to grid grid-cols-2 so it never squishes the inputs */}
      <div className="border border-gray-300 rounded-xl overflow-hidden grid grid-cols-2 divide-x divide-gray-300 focus-within:ring-2 focus-within:ring-orange-600 focus-within:border-transparent transition-all">
        
        <div className="p-3 bg-white hover:bg-gray-50 transition-colors min-w-0">
          <label htmlFor="booking-checkin" className="block text-[10px] font-bold text-gray-800 uppercase tracking-wide mb-1 truncate">
            Check-in
          </label>
          <input
            id="booking-checkin"
            type="date"
            min={todayISODate()}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full text-sm text-gray-700 bg-transparent focus:outline-none cursor-pointer"
          />
        </div>
        
        <div className="p-3 bg-white hover:bg-gray-50 transition-colors min-w-0">
          <label htmlFor="booking-checkout" className="block text-[10px] font-bold text-gray-800 uppercase tracking-wide mb-1 truncate">
            Check-out
          </label>
          <input
            id="booking-checkout"
            type="date"
            min={checkIn || todayISODate()}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full text-sm text-gray-700 bg-transparent focus:outline-none cursor-pointer"
          />
        </div>
      </div>
      
      {/* Error Messages */}
      {(errors.checkIn || errors.checkOut) && (
        <div className="bg-red-50 text-red-600 text-xs p-2 rounded-lg border border-red-100">
          {errors.checkIn && <p>• {errors.checkIn}</p>}
          {errors.checkOut && <p>• {errors.checkOut}</p>}
        </div>
      )}

      {/* Price Summary */}
      {nights > 0 && (
        <div className="flex flex-col gap-2 mt-2 px-1">
          <div className="flex justify-between text-base text-gray-600">
            <span className="underline decoration-gray-300 underline-offset-4">
              ${listing.pricePerNight} × {nights} night{nights > 1 ? "s" : ""}
            </span>
            <span>${totalPrice}</span>
          </div>
          <hr className="border-gray-200 my-2" />
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total before taxes</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-orange-700 text-white font-semibold py-3.5 mt-2 rounded-xl hover:bg-orange-800 disabled:opacity-70 transition-all duration-200 shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {submitting && (
          <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        )}
        {submitting ? "Confirming..." : "Reserve"}
      </button>
      
      {!submitting && (
         <p className="text-center text-xs text-gray-500 mt-1">You won't be charged yet</p>
      )}
    </form>
  );
}