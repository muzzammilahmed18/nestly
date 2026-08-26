const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function signupRequest({ name, email, password, role }) {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Signup failed");
  return data;
}

export async function loginRequest({ email, password }) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  return data;
}

export async function getMe(token) {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Session invalid");
  return res.json();
}

// ---- Listings (public reads, host-only writes) ----

export async function getListings(filters = {}) {
  const params = new URLSearchParams();
  if (filters.location) params.set("location", filters.location);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.guests) params.set("guests", filters.guests);

  const query = params.toString();
  const res = await fetch(`${BASE_URL}/listings${query ? `?${query}` : ""}`);
  if (!res.ok) throw new Error("Failed to load listings");
  return res.json();
}

export async function getListing(id) {
  const res = await fetch(`${BASE_URL}/listings/${id}`);
  if (!res.ok) throw new Error("Failed to load this listing");
  return res.json();
}


// ---- Host-only listing management (all need the auth token) ----

function authHeaders(token) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export async function getMyListings(token) {
  const res = await fetch(`${BASE_URL}/my-listings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to load your listings");
  return res.json();
}

export async function createListing(data, token) {
  const res = await fetch(`${BASE_URL}/listings`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    const err = new Error(result.error || "Failed to create listing");
    err.fieldErrors = result.errors || null;
    throw err;
  }
  return result;
}

export async function updateListing(id, data, token) {
  const res = await fetch(`${BASE_URL}/listings/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    const err = new Error(result.error || "Failed to update listing");
    err.fieldErrors = result.errors || null;
    throw err;
  }
  return result;
}

export async function deleteListing(id, token) {
  const res = await fetch(`${BASE_URL}/listings/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete listing");
  return res.json();
}


// ---- Cloudinary — the browser uploads directly to Cloudinary, not
// through our backend. Only the resulting URL ever touches our server.

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export function uploadToCloudinary(file, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data.secure_url);
        } else {
          reject(new Error(data.error?.message || "Upload failed"));
        }
      } catch {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed — check your connection"));

    xhr.send(formData);
  });
}


// ---- Bookings ----

export async function createBooking(data, token) {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    const err = new Error(result.error || "Failed to create booking");
    err.fieldErrors = result.errors || null;
    err.status = res.status;
    throw err;
  }
  return result;
}

export async function getMyBookings(token) {
  const res = await fetch(`${BASE_URL}/my-bookings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to load your bookings");
  return res.json();
}

export async function cancelBooking(id, token) {
  const res = await fetch(`${BASE_URL}/bookings/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to cancel booking");
  return res.json();
}


export async function getHostBookings(token) {
  const res = await fetch(`${BASE_URL}/host/bookings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to load your bookings");
  return res.json();
}


// ---- Admin ----

export async function getAdminStats(token) {
  const res = await fetch(`${BASE_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Failed to load admin stats");
  return res.json();
}

export async function getAdminUsers(token) {
  const res = await fetch(`${BASE_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Failed to load users");
  return res.json();
}

export async function getAdminListings(token) {
  const res = await fetch(`${BASE_URL}/admin/listings`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Failed to load listings");
  return res.json();
}

export async function adminDeleteListing(id, token) {
  const res = await fetch(`${BASE_URL}/admin/listings/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete listing");
  return res.json();
}