import { useEffect } from "react";

export default function Toast({ message, type = "success", onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const isSuccess = type === "success";

  // Premium dark pill for success, distinct red pill for errors
  const styles = isSuccess 
    ? "bg-gray-900 text-white" 
    : "bg-red-600 text-white";

  const icon = isSuccess ? "✓" : "!";
  const iconStyles = isSuccess 
    ? "bg-emerald-500 text-white" 
    : "bg-white text-red-600";

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-sm font-semibold flex items-center gap-3 transition-all ${styles}`}
    >
      <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold shrink-0 ${iconStyles}`}>
        {icon}
      </span>
      
      <span className="tracking-wide">{message}</span>
      
      <button 
        onClick={onDismiss} 
        className="ml-2 opacity-60 hover:opacity-100 transition-opacity p-1 text-xs"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
}