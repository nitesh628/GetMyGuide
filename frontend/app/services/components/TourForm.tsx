"use client";

import { useState } from "react";
import { TourData } from "../types/tour";
import { X, Upload, MapPin } from "lucide-react";

interface Props {
  onSubmit: (data: TourData) => void;
}

const MAX_IMAGES = 8;

export default function TourForm({ onSubmit }: Props) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      e.currentTarget.value = "";
      return;
    }

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setErrors({ ...errors, images: `Maximum ${MAX_IMAGES} images allowed` });
      e.currentTarget.value = "";
      return;
    }

    let acceptedFiles = files;
    if (files.length > remaining) {
      acceptedFiles = files.slice(0, remaining);
      setErrors({
        ...errors,
        images: `Only ${acceptedFiles.length} images were added to reach the maximum of ${MAX_IMAGES}`,
      });
    } else {
      setErrors({ ...errors, images: "" });
    }

    const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...acceptedFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);

    // Clear input so same file can be selected again if needed
    e.currentTarget.value = "";
  };

  const removeImage = (index: number) => {
    // Revoke the preview URL for the removed image
    URL.revokeObjectURL(previews[index]);

    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setErrors({ ...errors, images: "" });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.name.trim()) newErrors.name = "Tour name is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (images.length === 0)
      newErrors.images = "At least one image is required";

    // no numeric fields anymore

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const tourData: TourData = {
      id: Date.now().toString(),
      ...form,
      images,
    };

    onSubmit(tourData);

    // Reset form and revoke preview URLs
    previews.forEach((url) => URL.revokeObjectURL(url));

    setForm({
      name: "",
      description: "",
      location: "",
    });
    setImages([]);
    setPreviews([]);
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl shadow-xl p-8 border-2 border-slate-100"
    >
      <h2 className="text-3xl font-bold mb-8 text-slate-800">
        Services
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Form Fields */}
        <div className="space-y-6">
          {/* Tour Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tour Name *
            </label>
            <input
              type="text"
              value={form.name}
              placeholder="Old Delhi Heritage Walk"
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${
                errors.name
                  ? "border-red-300 bg-red-50"
                  : "border-slate-200 focus:border-blue-400 focus:bg-blue-50/30"
              }`}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setErrors({ ...errors, name: "" });
              }}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Location *
            </label>
            <input
              type="text"
              value={form.location}
              placeholder="Delhi"
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${
                errors.location
                  ? "border-red-300 bg-red-50"
                  : "border-slate-200 focus:border-blue-400 focus:bg-blue-50/30"
              }`}
              onChange={(e) => {
                setForm({ ...form, location: e.target.value });
                setErrors({ ...errors, location: "" });
              }}
            />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location}</p>
            )}
          </div>

          {/* Price and Duration */}
          {/* Price and Duration removed */}

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              value={form.description}
              placeholder="Describe your tour..."
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none resize-none ${
                errors.description
                  ? "border-red-300 bg-red-50"
                  : "border-slate-200 focus:border-blue-400 focus:bg-blue-50/30"
              }`}
              onChange={(e) => {
                setForm({ ...form, description: e.target.value });
                setErrors({ ...errors, description: "" });
              }}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Right Column - Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <Upload className="inline w-4 h-4 mr-1" />
            Tour Images * (Max {MAX_IMAGES})
          </label>

          <label
            className={`block w-full h-40 border-3 border-dashed rounded-2xl cursor-pointer transition-all hover:bg-blue-50 ${
              errors.images
                ? "border-red-300 bg-red-50"
                : "border-slate-300 hover:border-blue-400"
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <Upload className="w-10 h-10 mb-2" />
              <p className="text-sm font-medium">Click to upload images</p>
              <p className="text-xs mt-1">PNG, JPG up to 10MB</p>
            </div>
          </label>
          {errors.images && (
            <p className="text-red-500 text-xs mt-1">{errors.images}</p>
          )}

          {/* Image Previews */}
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {previews.map((src, i) => (
                <div key={i} className="relative group">
                  <img
                    src={src}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-24 object-cover rounded-lg border-2 border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-levender-600 to-green-600 text-blue font-bold py-4 px-6 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          Create Tour
        </button>
      </div>
    </form>
  );
}
