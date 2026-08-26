import { Link } from "react-router-dom";

export default function ListingCard({ listing }) {
  const photo = listing.photos?.[0];

  return (
    <Link
      to={`/listings/${listing.id}`}
      className="group block flex flex-col gap-3 cursor-pointer"
    >
      {/* Image Container with Airbnb-style aspect ratio */}
      <div className="w-full aspect-square overflow-hidden rounded-xl bg-gray-100 relative">
        {photo ? (
          <img 
            src={photo} 
            alt={listing.title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            🏠
          </div>
        )}
        
        {/* Optional: Add a subtle gradient overlay at the bottom if you want text over images later */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div> */}
      </div>

      {/* Content Below Image */}
      <div className="flex flex-col">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-gray-900 truncate text-base leading-snug">
            {listing.location}
          </h3>
          {/* Placeholder for rating if you ever add it */}
          {/* <span className="flex items-center gap-1 text-sm"><span className="text-xs">★</span> 4.9</span> */}
        </div>
        
        <p className="text-sm text-gray-500 truncate mt-0.5">{listing.title}</p>
        <p className="text-sm text-gray-500">Up to {listing.maxGuests} guests</p>
        
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-semibold text-gray-900">${listing.pricePerNight}</span>
          <span className="text-sm text-gray-600">night</span>
        </div>
      </div>
    </Link>
  );
}