"use client";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const languageOptions = [
  "English",
  "Spanish",
  "French",
  "Japanese",
  "Russian",
  "Chinese",
  "German",
  "Italian",
  "Portuguese",
  "Thai",
  "Arabic",
  "Other",
];

export default function BecomeGuidePage() {
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [pan, setPan] = useState("");
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [aadhaarPreview, setAadhaarPreview] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [showLangError, setShowLangError] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [guideType, setGuideType] = useState<"Escort" | "Normal" | "">("");
  const [nameError, setNameError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) => {
      const exists = prev.includes(lang);
      const next = exists ? prev.filter((l) => l !== lang) : [...prev, lang];
      if (!exists) setShowLangError(false);
      return next;
    });
  };

  const removeLanguage = (lang: string) => {
    setLanguages((prev) => {
      const next = prev.filter((l) => l !== lang);
      if (next.length > 0) setShowLangError(false);
      return next;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setProfileFile(f);
    if (f) setProfilePreview(URL.createObjectURL(f));
    else setProfilePreview(null);
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setAadhaarFile(f);
    if (f) setAadhaarPreview(URL.createObjectURL(f));
    else setAadhaarPreview(null);
  };

  // String validation function
  const validateString = (value: string, fieldName: string): string => {
    if (!value.trim()) {
      return `${fieldName} is required.`;
    }
    if (!/^[a-zA-Z\s]+$/.test(value)) {
      return `${fieldName} should only contain letters and spaces.`;
    }
    if (value.trim().length < 2) {
      return `${fieldName} should be at least 2 characters long.`;
    }
    return "";
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (value.trim()) {
      setNameError(validateString(value, "Name"));
    } else {
      setNameError("");
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    if (value.trim()) {
      setLocationError(validateString(value, "Location"));
    } else {
      setLocationError("");
    }
  };

  // Phone validation function
  const validatePhone = (value: string): string => {
    if (!value.trim()) {
      return "Phone number is required.";
    }
    if (!/^\d{10}$/.test(value)) {
      return "Phone number must be exactly 10 digits.";
    }
    return "";
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length <= 10) {
      setPhone(value);
      if (value.length > 0) {
        setPhoneError(validatePhone(value));
      } else {
        setPhoneError("");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validate name
    const nameValidation = validateString(name, "Name");
    if (nameValidation) {
      setNameError(nameValidation);
      setMessage(nameValidation);
      return;
    }

    // Validate location
    const locationValidation = validateString(location, "Location");
    if (locationValidation) {
      setLocationError(locationValidation);
      setMessage(locationValidation);
      return;
    }

    // Validate phone
    const phoneValidation = validatePhone(phone);
    if (phoneValidation) {
      setPhoneError(phoneValidation);
      setMessage(phoneValidation);
      return;
    }

    if (languages.length === 0) {
      setShowLangError(true);
      setMessage("Please select at least one preferred language.");
      return;
    }
    if (!profileFile) {
      setMessage("Please upload a profile image.");
      return;
    }
    if (!file) {
      setMessage("Please upload your license/ID image.");
      return;
    }
    if (!aadhaarFile) {
      setMessage("Please upload your Aadhaar (image or PDF).");
      return;
    }
    if (!guideType) {
      setMessage("Please select a guide type.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setMessage(
        "Application submitted successfully — we will review it shortly."
      );
      setName("");
      setPan("");
      setAadhaarFile(null);
      setAadhaarPreview(null);
      setProfileFile(null);
      setProfilePreview(null);
      setLocation("");
      setLanguages([]);
      setShowLangError(false);
      setFile(null);
      setPreview(null);
      setGuideType("");
      setNameError("");
      setLocationError("");
      setPhone("");
      setPhoneError("");
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-5xl mx-auto">
        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Decorative top border */}
          <div className="h-2 bg-gradient-to-r from-indigo-400 via-orange-500 to-pink-600"></div>

          <div className="p-8 md:p-12">
            <form className="space-y-10" onSubmit={handleSubmit}>
              {/* Profile Section */}
              <div className="relative">
                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-orange-400 to-orange-600 rounded-full"></div>
                <h1 className="text-2xl mb-1.5 font-serif font-extrabold ">
                  Guide Registration Form
                </h1>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600 text-sm font-bold">
                    1
                  </span>
                  Personal Information
                </h2>

                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Profile Image Upload */}
                    <div className="relative group">
                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-white-400 to-grey-600 shadow-xl overflow-hidden flex items-center justify-center border-4 border-white transition-transform duration-300 group-hover:scale-105">
                        {profilePreview ? (
                          <img
                            src={profilePreview}
                            alt="profile preview"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex flex-col items-center text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <div className="text-sm mt-2 font-medium">
                              Add Photo
                            </div>
                          </div>
                        )}
                      </div>

                      <label className="absolute bottom-2 right-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full p-3 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-110">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfileChange}
                          className="sr-only"
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </label>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Profile Picture
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Upload a clear photo where your face is visible. This
                        helps travelers recognize you and builds trust.
                      </p>
                      <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-white px-3 py-1 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        JPG, PNG — up to 5MB
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <input
                        value={name}
                        onChange={handleNameChange}
                        className={`w-full border-2 ${
                          nameError ? "border-red-500" : "border-gray-200"
                        } rounded-xl pl-12 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300`}
                        placeholder="Enter your full name"
                        aria-label="Full name"
                      />
                    </div>
                    {nameError && (
                      <p className="text-sm text-red-600 mt-1">{nameError}</p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Guide Location
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <input
                        value={location}
                        onChange={handleLocationChange}
                        className={`w-full border-2 ${
                          locationError ? "border-red-500" : "border-gray-200"
                        } rounded-xl pl-12 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300`}
                        placeholder="City, State"
                        aria-label="Location"
                      />
                    </div>
                    {locationError && (
                      <p className="text-sm text-red-600 mt-1">
                        {locationError}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        maxLength={10}
                        className={`w-full border-2 ${
                          phoneError ? "border-red-500" : "border-gray-200"
                        } rounded-xl pl-12 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300`}
                        placeholder="10-digit phone number"
                        aria-label="Phone number"
                      />
                    </div>
                    {phoneError && (
                      <p className="text-sm text-red-600 mt-1">{phoneError}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Verification Documents */}
              <div className="relative">
                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600 text-sm font-bold">
                    2
                  </span>
                  Verification Documents
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* PAN Card */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      PAN Card Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                      <input
                        value={pan}
                        onChange={(e) => setPan(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 uppercase"
                        placeholder="ABCDE1234F"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  {/* Guide Type */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Guide Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={guideType}
                        onChange={(e) =>
                          setGuideType(
                            e.target.value as "Escort" | "Normal" | ""
                          )
                        }
                        className="w-full border-2 border-gray-200 rounded-xl pl-4 pr-10 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 appearance-none"
                        aria-label="Guide Type"
                      >
                        {/* <option value="">Select Guide Type</option> */}
                        <option value="Escort">Escort Guide</option>
                        <option value="Normal">Normal Guide</option>
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* License/ID Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ID / License <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name="license"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                        id="license-upload"
                        aria-label="Upload license or ID"
                      />
                      <label
                        htmlFor="license-upload"
                        className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-3 cursor-pointer hover:border-purple-500 transition-all duration-300 bg-gray-50 hover:bg-purple-50"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">
                          {file ? file.name : "Choose file (JPG, PNG)"}
                        </span>
                      </label>
                    </div>
                    {preview && (
                      <div className="mt-4 rounded-xl overflow-hidden border-2 border-gray-200 shadow-md">
                        <img
                          src={preview}
                          alt="license preview"
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Aadhaar Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Aadhaar Card <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleAadhaarChange}
                        className="hidden"
                        id="aadhaar-upload"
                        aria-label="Upload Aadhaar"
                      />
                      <label
                        htmlFor="aadhaar-upload"
                        className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-3 cursor-pointer hover:border-purple-500 transition-all duration-300 bg-gray-50 hover:bg-purple-50"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">
                          {aadhaarFile
                            ? aadhaarFile.name
                            : "Choose file (JPG, PNG, PDF)"}
                        </span>
                      </label>
                    </div>
                    {aadhaarPreview && (
                      <div className="mt-4 rounded-xl overflow-hidden border-2 border-gray-200 shadow-md">
                        {aadhaarFile &&
                        aadhaarFile.type === "application/pdf" ? (
                          <div className="flex items-center justify-center h-48 bg-gradient-to-br from-purple-50 to-pink-50">
                            <a
                              href={aadhaarPreview}
                              target="_blank"
                              rel="noreferrer"
                              className="flex flex-col items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="text-sm font-medium underline">
                                View PDF Document
                              </span>
                            </a>
                          </div>
                        ) : (
                          <img
                            src={aadhaarPreview}
                            alt="aadhaar preview"
                            className="w-full h-48 object-cover"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Languages Section */}
              <div className="relative">
                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-pink-500 to-purple-600 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-100 text-pink-600 text-sm font-bold">
                    3
                  </span>
                  Preferred Languages
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Languages <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-gray-600 mb-4">
                    NOTE - If you know languages other than English, you will
                    get Rs 800+ extra per attended tour.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {languageOptions.map((lang) => (
                      <label
                        key={lang}
                        className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-pink-50 hover:border-pink-300 transition-all duration-300"
                      >
                        <input
                          type="checkbox"
                          checked={languages.includes(lang)}
                          onChange={() => toggleLanguage(lang)}
                          className="h-4 w-4 text-pink-600 rounded focus:ring-pink-500"
                          aria-label={`Language ${lang}`}
                        />
                        <span className="text-sm text-gray-700 font-medium">
                          {lang}
                        </span>
                      </label>
                    ))}
                  </div>

                  {languages.length > 0 && (
                    <div className="mt-4 p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl border-2 border-pink-200">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Selected Languages:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {languages.map((l) => (
                          <span
                            key={l}
                            className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-white text-pink-700 border-2 border-pink-300 shadow-sm"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                              />
                            </svg>
                            <span className="mr-2">{l}</span>
                            <button
                              type="button"
                              onClick={() => removeLanguage(l)}
                              aria-label={`Remove ${l}`}
                              className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {showLangError && languages.length === 0 && (
                    <p className="text-sm text-red-600 mt-2">
                      Please select at least one preferred language.
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full group relative inline-flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center gap-3">
                    {submitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </>
                    )}
                  </span>
                </button>

                {message && (
                  <div
                    className={`mt-6 p-4 rounded-xl ${
                      message.includes("successfully")
                        ? "bg-green-50 border-2 border-green-200"
                        : "bg-red-50 border-2 border-red-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {message.includes("successfully") ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-green-600 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-red-600 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                      <p
                        className={`text-sm font-medium ${
                          message.includes("successfully")
                            ? "text-green-800"
                            : "text-red-800"
                        }`}
                      >
                        {message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            🔒 Your information is secure and will only be used for verification
            purposes
          </p>
        </div>
      </div>
    </div>
  );
}
