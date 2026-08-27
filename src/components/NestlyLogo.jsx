export default function NestlyLogo({ className = "w-8 h-8", withText = false }) {
  return (
    <div className="flex items-center gap-2.5">
      {/* Brand Icon */}
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Sunset Orange Gradient Definition */}
          <defs>
            <linearGradient id="nestly-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EA580C" /> {/* orange-600 */}
              <stop offset="100%" stopColor="#FB923C" /> {/* orange-400 */}
            </linearGradient>
          </defs>

          {/* Background Soft Glow / Shape */}
          <rect width="40" height="40" rx="12" fill="url(#nestly-grad)" />

          {/* Nest Bottom Arc (Coziness / Shelter) */}
          <path
            d="M10 24C10 29.5228 14.4772 34 20 34C25.5228 34 30 29.5228 30 24"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Pitched Roof (Home / Haven) */}
          <path
            d="M12 18.5L20 11L28 18.5"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Center Hearth / Sun Point */}
          <circle cx="20" cy="22" r="3" fill="white" />
        </svg>
      </div>

      {/* Brand Wordmark (Optional) */}
      {withText && (
        <span className="font-bold text-xl tracking-tight text-gray-900 flex items-center">
          Nestly<span className="text-orange-600">.</span>
        </span>
      )}
    </div>
  );
}