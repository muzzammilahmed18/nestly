import { useRef, useState, useEffect } from "react";
import { uploadToCloudinary } from "../api";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PHOTOS = 6;

// Manages a list of already-uploaded photo URLs (photos prop) and lets
// the user add more (drag-and-drop or click) or remove existing ones.
// Each new file uploads immediately, straight to Cloudinary, with its
// own progress indicator.
export default function PhotoUploader({ photos, onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  // Tracks the latest photo list outside of React's render cycle, so
  // when multiple uploads finish close together, each one builds on
  // top of the others instead of all overwriting each other with a
  // stale copy of the array from when they started.
  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  function validate(file) {
    if (!file.type.startsWith("image/")) return "Please choose an image file.";
    if (file.size > MAX_SIZE) return "Each image must be under 5MB.";
    return null;
  }

  function handleFiles(fileList) {
    const files = Array.from(fileList).slice(0, MAX_PHOTOS - photos.length);
    if (files.length === 0) return;

    setError(null);

    files.forEach((file) => {
      const validationError = validate(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setUploadingCount((c) => c + 1);
      uploadToCloudinary(file)
        .then((url) => {
          const next = [...photosRef.current, url];
          photosRef.current = next;
          onChange(next);
        })
        .catch((err) => setError(err.message || "Upload failed."))
        .finally(() => setUploadingCount((c) => c - 1));
    });
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  function removePhoto(url) {
    onChange(photos.filter((p) => p !== url));
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Photos <span className="text-gray-400 font-normal">(optional, up to {MAX_PHOTOS})</span>
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-2">
        {photos.map((url) => (
          <div key={url} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <img src={url} alt="Listing" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(url)}
              className="absolute top-2 right-2 bg-black/60 text-white text-xs w-7 h-7 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 hover:scale-105 active:scale-95"
              aria-label="Remove photo"
            >
              ✕
            </button>
          </div>
        ))}

        {photos.length < MAX_PHOTOS && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
            className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
              isDragging 
                ? "border-orange-500 bg-orange-50" 
                : "border-gray-300 bg-gray-50/50 hover:bg-gray-100 hover:border-gray-400"
            }`}
          >
            {uploadingCount > 0 ? (
              <div className="w-8 h-8 border-2 border-gray-200 border-t-orange-600 rounded-full animate-spin" />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <span className="text-3xl mb-1">📷</span>
                <span className="text-xs font-medium">Add photo</span>
              </div>
            )}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      <div className="flex justify-between items-start mt-2">
        <p className="text-xs font-medium text-gray-500">Click or drag images in, one at a time or several at once.</p>
        {error && <p className="text-red-500 text-xs font-medium ml-4">{error}</p>}
      </div>
    </div>
  );
}