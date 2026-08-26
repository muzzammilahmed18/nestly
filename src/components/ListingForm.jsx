import { useState, useEffect } from "react";
import PhotoUploader from "./PhotoUploader";

const emptyForm = { title: "", description: "", location: "", pricePerNight: "", maxGuests: "", photos: [] };

// Reused for both creating a new listing and editing an existing one —
// editingListing is null for create mode, or a listing object for edit
// mode (the form pre-fills and the submit button label/action changes).
export default function ListingForm({ editingListing, onSubmit, onCancelEdit, submitting, serverFieldErrors }) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingListing) {
            setForm({
                title: editingListing.title,
                description: editingListing.description,
                location: editingListing.location,
                pricePerNight: editingListing.pricePerNight,
                maxGuests: editingListing.maxGuests,
                photos: editingListing.photos || [],
            });
        } else {
            setForm(emptyForm);
        }
        setErrors({});
    }, [editingListing]);

    function validate() {
        const next = {};
        if (!form.title.trim() || form.title.trim().length < 3) {
            next.title = "Title must be at least 3 characters.";
        }
        if (!form.description.trim() || form.description.trim().length < 10) {
            next.description = "Description must be at least 10 characters.";
        }
        if (!form.location.trim()) {
            next.location = "Location is required.";
        }
        const price = Number(form.pricePerNight);
        if (!form.pricePerNight || isNaN(price) || price <= 0) {
            next.pricePerNight = "Enter a positive price.";
        }
        const guests = Number(form.maxGuests);
        if (!form.maxGuests || isNaN(guests) || guests < 1) {
            next.maxGuests = "Must allow at least 1 guest.";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;
        onSubmit(form, () => setForm(emptyForm));
    }

    const allErrors = { ...errors, ...serverFieldErrors };
    const isEditing = !!editingListing;

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">
                {isEditing ? `Edit "${editingListing.title}"` : "List a new place"}
            </h2>

            <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                    <label htmlFor="listing-title" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Title
                    </label>
                    <input
                        id="listing-title"
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Cozy Mountain Cabin"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 transition-colors bg-gray-50/50 focus:bg-white"
                    />
                    {allErrors.title && <p className="text-red-500 text-xs font-medium mt-1.5">{allErrors.title}</p>}
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="listing-description" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Description
                    </label>
                    <textarea
                        id="listing-description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={4}
                        placeholder="Describe the place, the vibe, what's nearby..."
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 transition-colors bg-gray-50/50 focus:bg-white resize-y"
                    />
                    {allErrors.description && <p className="text-red-500 text-xs font-medium mt-1.5">{allErrors.description}</p>}
                </div>

                <div className="sm:col-span-2">
                    <PhotoUploader
                        photos={form.photos}
                        onChange={(photos) => setForm({ ...form, photos })}
                    />
                </div>

                <div>
                    <label htmlFor="listing-location" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Location
                    </label>
                    <input
                        id="listing-location"
                        type="text"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        placeholder="Aspen, CO"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 transition-colors bg-gray-50/50 focus:bg-white"
                    />
                    {allErrors.location && <p className="text-red-500 text-xs font-medium mt-1.5">{allErrors.location}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="listing-price" className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Price / night
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                            <input
                                id="listing-price"
                                type="number"
                                min="1"
                                value={form.pricePerNight}
                                onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
                                className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 transition-colors bg-gray-50/50 focus:bg-white"
                            />
                        </div>
                        {allErrors.pricePerNight && <p className="text-red-500 text-xs font-medium mt-1.5">{allErrors.pricePerNight}</p>}
                    </div>

                    <div>
                        <label htmlFor="listing-guests" className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Max guests
                        </label>
                        <input
                            id="listing-guests"
                            type="number"
                            min="1"
                            value={form.maxGuests}
                            onChange={(e) => setForm({ ...form, maxGuests: e.target.value })}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 transition-colors bg-gray-50/50 focus:bg-white"
                        />
                        {allErrors.maxGuests && <p className="text-red-500 text-xs font-medium mt-1.5">{allErrors.maxGuests}</p>}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-orange-700 text-white font-semibold px-8 py-3 rounded-xl hover:bg-orange-800 disabled:opacity-70 transition-all duration-200 shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {submitting && (
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    )}
                    {submitting ? "Saving..." : isEditing ? "Update listing" : "Create listing"}
                </button>
                
                {isEditing && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="font-semibold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 px-6 py-3 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}