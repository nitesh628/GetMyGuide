// "use client";

// import { useState } from "react";

// const languageOptions = [
//   "English",
//   "Spanish",
//   "French",
//   "Japanese",
//   "Russian",
//   "Chinese",
//   "German",
//   "Italian",
//   "Portuguese",
//   "Thai",
//   "Arabic",
//   "Other",
// ];

// interface FormErrors {
//   name?: string;
//   phone?: string;
//   email?: string;
//   place?: string;
//   languages?: string;
//   gender?: string;
//   persons?: string;
//   country?: string;
//   guideGender?: string;
// }

// export default function GuideFormPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     place: "",
//     languages: [] as string[],
//     gender: "",
//     persons: 1,
//     country: "",
//     guideGender: "",
//   });

//   const [errors, setErrors] = useState<FormErrors>({});
//   const [touched, setTouched] = useState<Set<string>>(new Set());
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Validation functions
//   const validateName = (name: string): string | undefined => {
//     if (!name.trim()) return "Full name is required";
//     if (name.trim().length < 2) return "Name must be at least 2 characters";
//     if (!/^[a-zA-Z\s]+$/.test(name)) return "Name should only contain letters";
//     return undefined;
//   };

//   const validatePhone = (phone: string): string | undefined => {
//     if (!phone.trim()) return "Phone number is required";
//     const phoneRegex =
//       /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{4,10}$/;
//     if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
//       return "Please enter a valid phone number";
//     }
//     return undefined;
//   };

//   const validateEmail = (email: string): string | undefined => {
//     if (!email.trim()) return "Email address is required";
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) return "Please enter a valid email address";
//     return undefined;
//   };

//   const validatePlace = (place: string): string | undefined => {
//     if (!place.trim()) return "Place to visit is required";
//     if (place.trim().length < 2)
//       return "Place name must be at least 2 characters";
//     return undefined;
//   };

//   const validateCountry = (country: string): string | undefined => {
//     if (!country.trim()) return "Country is required";
//     if (country.trim().length < 2)
//       return "Country name must be at least 2 characters";
//     return undefined;
//   };

//   const validateLanguages = (languages: string[]): string | undefined => {
//     if (languages.length === 0) return "Please select at least one language";
//     return undefined;
//   };

//   const validateGender = (gender: string): string | undefined => {
//     if (!gender) return "Please select your gender";
//     return undefined;
//   };

//   const validateGuideGender = (guideGender: string): string | undefined => {
//     if (!guideGender) return "Please select preferred guide gender";
//     return undefined;
//   };

//   const validatePersons = (persons: number): string | undefined => {
//     if (persons < 1) return "Number of persons must be at least 1";
//     if (persons > 50) return "Please contact us for groups larger than 50";
//     return undefined;
//   };

//   const validateField = (name: string, value: any): string | undefined => {
//     switch (name) {
//       case "name":
//         return validateName(value);
//       case "phone":
//         return validatePhone(value);
//       case "email":
//         return validateEmail(value);
//       case "place":
//         return validatePlace(value);
//       case "country":
//         return validateCountry(value);
//       case "languages":
//         return validateLanguages(value);
//       case "gender":
//         return validateGender(value);
//       case "guideGender":
//         return validateGuideGender(value);
//       case "persons":
//         return validatePersons(value);
//       default:
//         return undefined;
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     const newValue = name === "persons" ? parseInt(value) || 1 : value;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: newValue,
//     }));

//     // Validate on change if field was touched
//     if (touched.has(name)) {
//       const error = validateField(name, newValue);
//       setErrors((prev) => ({
//         ...prev,
//         [name]: error,
//       }));
//     }
//   };

//   const handleBlur = (
//     e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name } = e.target;
//     setTouched((prev) => new Set(prev).add(name));

//     const value =
//       name === "languages"
//         ? formData.languages
//         : formData[name as keyof typeof formData];
//     const error = validateField(name, value);
//     setErrors((prev) => ({
//       ...prev,
//       [name]: error,
//     }));
//   };

//   const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selected = Array.from(
//       e.target.selectedOptions,
//       (option) => option.value
//     );
//     setFormData((prev) => ({
//       ...prev,
//       languages: selected,
//     }));

//     if (touched.has("languages")) {
//       const error = validateLanguages(selected);
//       setErrors((prev) => ({
//         ...prev,
//         languages: error,
//       }));
//     }
//   };

//   const handleLanguageBlur = () => {
//     setTouched((prev) => new Set(prev).add("languages"));
//     const error = validateLanguages(formData.languages);
//     setErrors((prev) => ({
//       ...prev,
//       languages: error,
//     }));
//   };

//   const validateAllFields = (): boolean => {
//     const newErrors: FormErrors = {
//       name: validateName(formData.name),
//       phone: validatePhone(formData.phone),
//       email: validateEmail(formData.email),
//       place: validatePlace(formData.place),
//       country: validateCountry(formData.country),
//       languages: validateLanguages(formData.languages),
//       gender: validateGender(formData.gender),
//       guideGender: validateGuideGender(formData.guideGender),
//       persons: validatePersons(formData.persons),
//     };

//     setErrors(newErrors);

//     // Mark all fields as touched
//     setTouched(new Set(Object.keys(formData)));

//     return !Object.values(newErrors).some((error) => error !== undefined);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateAllFields()) {
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1500));
//       console.log("Form Data:", formData);
//       alert("Booking submitted successfully! We'll contact you soon.");

//       // Reset form
//       setFormData({
//         name: "",
//         phone: "",
//         email: "",
//         place: "",
//         languages: [],
//         gender: "",
//         persons: 1,
//         country: "",
//         guideGender: "",
//       });
//       setErrors({});
//       setTouched(new Set());
//     } catch (error) {
//       alert("An error occurred. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
//       <div className="max-w-3xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">
//             Book Your Guide
//           </h1>
//           <p className="text-gray-600">
//             Fill in the details below to find your perfect travel guide
//           </p>
//         </div>

//         {/* Form Card */}
//         <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Personal Information Section */}
//             <div className="space-y-6">
//               <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
//                 Personal Information
//               </h2>

//               {/* Name */}
//               <div>
//                 <label
//                   htmlFor="name"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   Full Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   placeholder="Enter your full name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
//                     errors.name && touched.has("name")
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                 />
//                 {errors.name && touched.has("name") && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <svg
//                       className="w-4 h-4 mr-1"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     {errors.name}
//                   </p>
//                 )}
//               </div>

//               {/* Gender */}
//               <div>
//                 <label
//                   htmlFor="gender"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   Gender <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   id="gender"
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
//                     errors.gender && touched.has("gender")
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                 >
//                   <option value="">Select your gender</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                   <option value="other">Other</option>
//                 </select>
//                 {errors.gender && touched.has("gender") && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <svg
//                       className="w-4 h-4 mr-1"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     {errors.gender}
//                   </p>
//                 )}
//               </div>

//               {/* Phone */}
//               <div>
//                 <label
//                   htmlFor="phone"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   Phone Number <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="tel"
//                   id="phone"
//                   name="phone"
//                   placeholder="+91 9876543210"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
//                     errors.phone && touched.has("phone")
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                 />
//                 {errors.phone && touched.has("phone") && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <svg
//                       className="w-4 h-4 mr-1"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     {errors.phone}
//                   </p>
//                 )}
//               </div>

//               {/* Email */}
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   Email Address <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   placeholder="you@example.com"
//                   value={formData.email}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
//                     errors.email && touched.has("email")
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                 />
//                 {errors.email && touched.has("email") && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <svg
//                       className="w-4 h-4 mr-1"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     {errors.email}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Travel Details Section */}
//             <div className="space-y-6 pt-4">
//               <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
//                 Travel Details
//               </h2>

//               {/* Place */}
//               <div>
//                 <label
//                   htmlFor="place"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   Place to Visit <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="place"
//                   name="place"
//                   placeholder="e.g., Khatu Shyam Ji"
//                   value={formData.place}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
//                     errors.place && touched.has("place")
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                 />
//                 {errors.place && touched.has("place") && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <svg
//                       className="w-4 h-4 mr-1"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     {errors.place}
//                   </p>
//                 )}
//               </div>

//               {/* Country */}
//               <div>
//                 <label
//                   htmlFor="country"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   Country <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="country"
//                   name="country"
//                   placeholder="e.g., India"
//                   value={formData.country}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
//                     errors.country && touched.has("country")
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                 />
//                 {errors.country && touched.has("country") && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <svg
//                       className="w-4 h-4 mr-1"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     {errors.country}
//                   </p>
//                 )}
//               </div>

//               {/* Number of Persons */}
//               <div>
//                 <label
//                   htmlFor="persons"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   Number of Persons <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   id="persons"
//                   name="persons"
//                   min={1}
//                   max={50}
//                   value={formData.persons}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
//                     errors.persons && touched.has("persons")
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                 />
//                 {errors.persons && touched.has("persons") && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <svg
//                       className="w-4 h-4 mr-1"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     {errors.persons}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Guide Preferences Section */}
//             <div className="space-y-6 pt-4">
//               <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
//                 Guide Preferences
//               </h2>

//               {/* Languages (Multi Select) */}
//               <div>
//                 <label
//                   htmlFor="languages"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   Guide Languages <span className="text-red-500">*</span>
//                 </label>
//                 <p className="text-sm text-gray-500 mb-2">
//                   Hold Ctrl (Cmd on Mac) to select multiple languages
//                 </p>
//                 <select
//                   id="languages"
//                   multiple
//                   value={formData.languages}
//                   onChange={handleLanguageChange}
//                   onBlur={handleLanguageBlur}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition h-40 ${
//                     errors.languages && touched.has("languages")
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                 >
//                   {languageOptions.map((lang) => (
//                     <option key={lang} value={lang} className="py-2">
//                       {lang}
//                     </option>
//                   ))}
//                 </select>
//                 {formData.languages.length > 0 && (
//                   <div className="mt-2 flex flex-wrap gap-2">
//                     {formData.languages.map((lang) => (
//                       <span
//                         key={lang}
//                         className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
//                       >
//                         {lang}
//                       </span>
//                     ))}
//                   </div>
//                 )}
//                 {errors.languages && touched.has("languages") && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <svg
//                       className="w-4 h-4 mr-1"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     {errors.languages}
//                   </p>
//                 )}
//               </div>

//               {/* Guide Gender */}
//               <div>
//                 <label
//                   htmlFor="guideGender"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   Preferred Guide Gender <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   id="guideGender"
//                   name="guideGender"
//                   value={formData.guideGender}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
//                     errors.guideGender && touched.has("guideGender")
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-300"
//                   }`}
//                 >
//                   {/* <option value="">Select guide gender preference</option> */}
//                   <option value="any">No Preference</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                 </select>
//                 {errors.guideGender && touched.has("guideGender") && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <svg
//                       className="w-4 h-4 mr-1"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     {errors.guideGender}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="pt-6">
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//               >
//                 {isSubmitting ? (
//                   <span className="flex items-center justify-center">
//                     <svg
//                       className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Submitting...
//                   </span>
//                 ) : (
//                   "Book Your Guide"
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Footer Note */}
//         <p className="text-center text-sm text-gray-500 mt-6">
//           By submitting this form, you agree to our terms of service and privacy
//           policy.
//         </p>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useMemo } from 'react';

// Types
interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  place: string;
  languages: string[];
  gender: string;
  persons: number;
  country: string;
  guideGender: string;
}

interface ServiceDetails {
  duration: 'half' | 'full';
  needsLanguageAllowance: boolean;
  isOutstation: boolean;
  outstationDistance?: number;
  outstationNights?: number;
  accommodationProvided?: boolean;
  excursionType?: string;
  city: string;
  needsEarlyLateConveyance: boolean;
  needsExtraAllowance: boolean;
  needsSpecialAllowance: boolean;
  specialAllowanceType?: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  place?: string;
  languages?: string;
  gender?: string;
  persons?: string;
  country?: string;
  guideGender?: string;
}

interface FeeBreakdown {
  baseFee: number;
  languageAllowance: number;
  outstationExcursionAllowance: number;
  outstationAccommodationAllowance: number;
  conveyanceAllowance: number;
  extraAllowance: number;
  specialAllowance: number;
  total: number;
}

// Constants
const languageOptions = [
  'English',
  'Spanish',
  'French',
  'Japanese',
  'Russian',
  'Chinese',
  'German',
  'Italian',
  'Portuguese',
  'Thai',
  'Arabic',
  'Other',
];

const GUIDE_FEES = {
  '1-5': { half: 2500, full: 3250 },
  '6-14': { half: 3250, full: 4000 },
  '15-40': { half: 4000, full: 5200 },
};

const LANGUAGE_ALLOWANCE = {
  '1-14': { half: 800, full: 1000 },
  '15+': { half: 1000, full: 1300 },
};

const OUTSTATION_EXCURSION = {
  standard: 2200,
  delhiAgraJaipur: 900,
};

const OUTSTATION_ACCOMMODATION = {
  noAccommodation: 5500,
  withAccommodation: 2250,
};

const CONVEYANCE = {
  metro: 850,
  other: 350,
};

const EXTRA_ALLOWANCE = 500;

const SPECIAL_ALLOWANCES: Record<string, number> = {
  kolkataGangaAarti: 400,
  kolkataVictoriaMemorial: 400,
  mumbaiElephanta: 500,
  varanasiMorningRiver: 400,
  varanasiEveningAarti: 500,
};

const CITIES_WITH_EXTRA = ['Delhi', 'Bangalore', 'Jaipur', 'Kochi', 'Mumbai', 'Kolkata', 'Chennai'];
const METRO_CITIES = ['Delhi', 'Mumbai', 'Kolkata', 'Chennai'];

const EXTRA_ALLOWANCE_EXCURSIONS = [
  'Hyderabad-Warrangal-Palampet',
  'Chennai-Kanchipuram-Mahabalipuram',
  'Chennai-Tirupathy/Thirumala',
  'Chennai-Pondicherry',
  'Madurai-Tanjore-Trichy',
  'Bangalore-Mysore-Brindavan',
  'Mumbai-Karla/Bhaja',
  'Aurangabad-Ajanta-Ellora',
  'Jaipur-Ajmer-Pushkar',
  'Varanasi-Kushinagar',
  'Varanasi-Bodh Gaya',
  'Agra-Gwalior',
  'Lucknow-Ayodhya',
];

export default function CombinedGuideBookingForm() {
  const [bookingData, setBookingData] = useState<BookingFormData>({
    name: '',
    phone: '',
    email: '',
    place: '',
    languages: [],
    gender: '',
    persons: 1,
    country: '',
    guideGender: '',
  });

  const [serviceDetails, setServiceDetails] = useState<ServiceDetails>({
    duration: 'half',
    needsLanguageAllowance: false,
    isOutstation: false,
    city: 'Delhi',
    needsEarlyLateConveyance: false,
    needsExtraAllowance: false,
    needsSpecialAllowance: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return 'Full name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name should only contain letters';
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) return 'Phone number is required';
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{4,10}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'Email address is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePlace = (place: string): string | undefined => {
    if (!place.trim()) return 'Place to visit is required';
    if (place.trim().length < 2) return 'Place name must be at least 2 characters';
    return undefined;
  };

  const validateCountry = (country: string): string | undefined => {
    if (!country.trim()) return 'Country is required';
    if (country.trim().length < 2) return 'Country name must be at least 2 characters';
    return undefined;
  };

  const validateLanguages = (languages: string[]): string | undefined => {
    if (languages.length === 0) return 'Please select at least one language';
    return undefined;
  };

  const validateGender = (gender: string): string | undefined => {
    if (!gender) return 'Please select your gender';
    return undefined;
  };

  const validateGuideGender = (guideGender: string): string | undefined => {
    if (!guideGender) return 'Please select preferred guide gender';
    return undefined;
  };

  const validatePersons = (persons: number): string | undefined => {
    if (persons < 1) return 'Number of persons must be at least 1';
    if (persons > 50) return 'Please contact us for groups larger than 50';
    return undefined;
  };

  const validateField = (name: string, value: any): string | undefined => {
    switch (name) {
      case 'name':
        return validateName(value);
      case 'phone':
        return validatePhone(value);
      case 'email':
        return validateEmail(value);
      case 'place':
        return validatePlace(value);
      case 'country':
        return validateCountry(value);
      case 'languages':
        return validateLanguages(value);
      case 'gender':
        return validateGender(value);
      case 'guideGender':
        return validateGuideGender(value);
      case 'persons':
        return validatePersons(value);
      default:
        return undefined;
    }
  };

  // Fee calculation
  const calculateFees = useMemo((): FeeBreakdown => {
    let baseFee = 0;
    let languageAllowance = 0;
    let outstationExcursionAllowance = 0;
    let outstationAccommodationAllowance = 0;
    let conveyanceAllowance = 0;
    let extraAllowance = 0;
    let specialAllowance = 0;

    // Calculate base guide fee
    if (bookingData.persons <= 5) {
      baseFee = GUIDE_FEES['1-5'][serviceDetails.duration];
    } else if (bookingData.persons <= 14) {
      baseFee = GUIDE_FEES['6-14'][serviceDetails.duration];
    } else {
      baseFee = GUIDE_FEES['15-40'][serviceDetails.duration];
    }

    // Calculate language allowance
    if (serviceDetails.needsLanguageAllowance) {
      if (bookingData.persons <= 14) {
        languageAllowance = LANGUAGE_ALLOWANCE['1-14'][serviceDetails.duration];
      } else {
        languageAllowance = LANGUAGE_ALLOWANCE['15+'][serviceDetails.duration];
      }
    }

    // Calculate outstation excursion allowance
    if (serviceDetails.isOutstation && serviceDetails.outstationDistance && serviceDetails.outstationDistance > 100) {
      outstationExcursionAllowance = OUTSTATION_EXCURSION.standard;
      
      if (serviceDetails.excursionType === 'Delhi-Agra-Delhi' || serviceDetails.excursionType === 'Delhi-Jaipur-Delhi') {
        outstationExcursionAllowance += OUTSTATION_EXCURSION.delhiAgraJaipur;
      }
    }

    // Calculate outstation accommodation allowance
    if (serviceDetails.isOutstation && serviceDetails.outstationNights && serviceDetails.outstationNights > 0) {
      const perNightRate = serviceDetails.accommodationProvided 
        ? OUTSTATION_ACCOMMODATION.withAccommodation 
        : OUTSTATION_ACCOMMODATION.noAccommodation;
      outstationAccommodationAllowance = perNightRate * serviceDetails.outstationNights;
    }

    // Calculate conveyance allowance
    if (serviceDetails.needsEarlyLateConveyance) {
      conveyanceAllowance = METRO_CITIES.includes(serviceDetails.city) 
        ? CONVEYANCE.metro 
        : CONVEYANCE.other;
    }

    // Calculate extra allowance
    if (serviceDetails.needsExtraAllowance && CITIES_WITH_EXTRA.includes(serviceDetails.city)) {
      extraAllowance = EXTRA_ALLOWANCE;
    }

    // Special allowances
    if (serviceDetails.needsSpecialAllowance && serviceDetails.specialAllowanceType) {
      specialAllowance = SPECIAL_ALLOWANCES[serviceDetails.specialAllowanceType] || 0;
    }

    // Extra allowance for tours exceeding 8 hours
    if (serviceDetails.excursionType && EXTRA_ALLOWANCE_EXCURSIONS.includes(serviceDetails.excursionType)) {
      extraAllowance += 1100;
    }

    const total = baseFee + languageAllowance + outstationExcursionAllowance + 
                  outstationAccommodationAllowance + conveyanceAllowance + 
                  extraAllowance + specialAllowance;

    return {
      baseFee,
      languageAllowance,
      outstationExcursionAllowance,
      outstationAccommodationAllowance,
      conveyanceAllowance,
      extraAllowance,
      specialAllowance,
      total,
    };
  }, [bookingData.persons, serviceDetails]);

  // Handle booking form changes
  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newValue = name === 'persons' ? parseInt(value) || 1 : value;

    setBookingData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (touched.has(name)) {
      const error = validateField(name, newValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched((prev) => new Set(prev).add(name));

    const value = name === 'languages' ? bookingData.languages : bookingData[name as keyof BookingFormData];
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setBookingData((prev) => ({
      ...prev,
      languages: selected,
    }));

    if (touched.has('languages')) {
      const error = validateLanguages(selected);
      setErrors((prev) => ({
        ...prev,
        languages: error,
      }));
    }
  };

  const handleLanguageBlur = () => {
    setTouched((prev) => new Set(prev).add('languages'));
    const error = validateLanguages(bookingData.languages);
    setErrors((prev) => ({
      ...prev,
      languages: error,
    }));
  };

  // Handle service details changes
  const handleServiceChange = (field: keyof ServiceDetails, value: any) => {
    setServiceDetails((prev) => ({ ...prev, [field]: value }));
  };

  const validateAllFields = (): boolean => {
    const newErrors: FormErrors = {
      name: validateName(bookingData.name),
      phone: validatePhone(bookingData.phone),
      email: validateEmail(bookingData.email),
      place: validatePlace(bookingData.place),
      country: validateCountry(bookingData.country),
      languages: validateLanguages(bookingData.languages),
      gender: validateGender(bookingData.gender),
      guideGender: validateGuideGender(bookingData.guideGender),
      persons: validatePersons(bookingData.persons),
    };

    setErrors(newErrors);
    setTouched(new Set(Object.keys(bookingData)));

    return !Object.values(newErrors).some((error) => error !== undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAllFields()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const submissionData = {
        booking: bookingData,
        service: serviceDetails,
        fee: calculateFees,
      };
      
      console.log('Form Data:', submissionData);
      alert(`Booking submitted successfully! Total Fee: ₹${calculateFees.total.toLocaleString()}`);

      // Reset form
      setBookingData({
        name: '',
        phone: '',
        email: '',
        place: '',
        languages: [],
        gender: '',
        persons: 1,
        country: '',
        guideGender: '',
      });
      setServiceDetails({
        duration: 'half',
        needsLanguageAllowance: false,
        isOutstation: false,
        city: 'Delhi',
        needsEarlyLateConveyance: false,
        needsExtraAllowance: false,
        needsSpecialAllowance: false,
      });
      setErrors({});
      setTouched(new Set());
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-600 to-red-600 rounded-full mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">Book Your Tour Guide</h1>
          <p className="text-lg text-gray-600">Complete booking with instant fee calculation</p>
          <p className="text-sm text-orange-600 mt-2 font-medium">IATO & TGFI Agreement | Valid Oct 2025 - Sep 2027</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Personal & Travel Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b-2 border-orange-600 pb-3">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h2>

                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={bookingData.name}
                      onChange={handleBookingChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition ${
                        errors.name && touched.has('name') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && touched.has('name') && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={bookingData.gender}
                      onChange={handleBookingChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition ${
                        errors.gender && touched.has('gender') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select your gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && touched.has('gender') && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.gender}
                      </p>
                    )}
                  </div>

                  {/* Phone & Email in Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="+91 9876543210"
                        value={bookingData.phone}
                        onChange={handleBookingChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition ${
                          errors.phone && touched.has('phone') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.phone && touched.has('phone') && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        value={bookingData.email}
                        onChange={handleBookingChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition ${
                          errors.email && touched.has('email') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.email && touched.has('email') && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Travel Details */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b-2 border-orange-600 pb-3">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Travel Details
                </h2>

                <div className="space-y-5">
                  {/* Place & Country */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="place" className="block text-sm font-semibold text-gray-700 mb-2">
                        Place to Visit <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="place"
                        name="place"
                        placeholder="e.g., Taj Mahal, Agra"
                        value={bookingData.place}
                        onChange={handleBookingChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition ${
                          errors.place && touched.has('place') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.place && touched.has('place') && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.place}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        placeholder="e.g., India"
                        value={bookingData.country}
                        onChange={handleBookingChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition ${
                          errors.country && touched.has('country') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.country && touched.has('country') && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.country}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Number of Persons */}
                  <div>
                    <label htmlFor="persons" className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Persons <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="persons"
                      name="persons"
                      min={1}
                      max={50}
                      value={bookingData.persons}
                      onChange={handleBookingChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition ${
                        errors.persons && touched.has('persons') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    <div className="mt-2 p-2 bg-orange-50 rounded border border-orange-200">
                      <p className="text-xs text-gray-700">
                        <span className="font-semibold">Base Fee Range: </span>
                        {bookingData.persons <= 5 && '₹2,500 (Half) / ₹3,250 (Full)'}
                        {bookingData.persons > 5 && bookingData.persons <= 14 && '₹3,250 (Half) / ₹4,000 (Full)'}
                        {bookingData.persons > 14 && '₹4,000 (Half) / ₹5,200 (Full)'}
                      </p>
                    </div>
                    {errors.persons && touched.has('persons') && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.persons}
                      </p>
                    )}
                  </div>

                  {/* City Selection */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="city"
                      value={serviceDetails.city}
                      onChange={(e) => handleServiceChange('city', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 transition"
                    >
                      <option value="Delhi">Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Jaipur">Jaipur</option>
                      <option value="Kochi">Kochi</option>
                      <option value="Agra">Agra</option>
                      <option value="Varanasi">Varanasi</option>
                      <option value="Other">Other City</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Guide Preferences */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b-2 border-orange-600 pb-3">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Guide Preferences
                </h2>

                <div className="space-y-5">
                  {/* Languages */}
                  <div>
                    <label htmlFor="languages" className="block text-sm font-semibold text-gray-700 mb-2">
                      Guide Languages <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-500 mb-2">Hold Ctrl (Cmd on Mac) to select multiple</p>
                    <select
                      id="languages"
                      multiple
                      value={bookingData.languages}
                      onChange={handleLanguageChange}
                      onBlur={handleLanguageBlur}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition h-40 ${
                        errors.languages && touched.has('languages') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      {languageOptions.map((lang) => (
                        <option key={lang} value={lang} className="py-2">
                          {lang}
                        </option>
                      ))}
                    </select>
                    {bookingData.languages.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {bookingData.languages.map((lang) => (
                          <span key={lang} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                            {lang}
                          </span>
                        ))}
                      </div>
                    )}
                    {errors.languages && touched.has('languages') && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.languages}
                      </p>
                    )}
                  </div>

                  {/* Guide Gender */}
                  <div>
                    <label htmlFor="guideGender" className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Guide Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="guideGender"
                      name="guideGender"
                      value={bookingData.guideGender}
                      onChange={handleBookingChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition ${
                        errors.guideGender && touched.has('guideGender') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select guide gender preference</option>
                      <option value="any">No Preference</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    {errors.guideGender && touched.has('guideGender') && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.guideGender}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b-2 border-orange-600 pb-3">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Service Details
                </h2>

                <div className="space-y-5">
                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Service Duration</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleServiceChange('duration', 'half')}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                          serviceDetails.duration === 'half'
                            ? 'bg-orange-600 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Half Day
                        <span className="block text-xs mt-1 opacity-80">Up to 4 hours</span>
                        <span className="block text-xs mt-1 font-bold">
                          ₹{bookingData.persons <= 5 ? '2,500' : bookingData.persons <= 14 ? '3,250' : '4,000'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleServiceChange('duration', 'full')}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                          serviceDetails.duration === 'full'
                            ? 'bg-orange-600 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Full Day
                        <span className="block text-xs mt-1 opacity-80">4 to 8 hours</span>
                        <span className="block text-xs mt-1 font-bold">
                          ₹{bookingData.persons <= 5 ? '3,250' : bookingData.persons <= 14 ? '4,000' : '5,200'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Language Allowance */}
                  <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-200">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={serviceDetails.needsLanguageAllowance}
                        onChange={(e) => handleServiceChange('needsLanguageAllowance', e.target.checked)}
                        className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">Foreign Language Required</span>
                          <span className="text-sm font-bold text-orange-600">
                            +₹{bookingData.persons <= 14 
                              ? (serviceDetails.duration === 'half' ? '800' : '1,000')
                              : (serviceDetails.duration === 'half' ? '1,000' : '1,300')
                            }
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Additional allowance for non-English languages</p>
                      </div>
                    </label>
                  </div>

                  {/* Outstation Service */}
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={serviceDetails.isOutstation}
                        onChange={(e) => handleServiceChange('isOutstation', e.target.checked)}
                        className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">Outstation Service</span>
                          <span className="text-xs font-bold text-orange-600">₹2,200 - ₹5,500+</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">For trips beyond 100km or overnight stays</p>
                      </div>
                    </label>
                    
                    {serviceDetails.isOutstation && (
                      <div className="mt-4 space-y-3 ml-8">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Distance (km) <span className="text-orange-600">• ₹2,200 if &gt;100km</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={serviceDetails.outstationDistance || ''}
                            onChange={(e) => handleServiceChange('outstationDistance', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Enter distance"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Overnight Stays <span className="text-orange-600">• ₹2,250 - ₹5,500 per night</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={serviceDetails.outstationNights || ''}
                            onChange={(e) => handleServiceChange('outstationNights', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Number of nights"
                          />
                        </div>
                        
                        {(serviceDetails.outstationNights || 0) > 0 && (
                          <label className="flex items-center gap-2 cursor-pointer bg-white p-2 rounded border border-blue-200">
                            <input
                              type="checkbox"
                              checked={serviceDetails.accommodationProvided}
                              onChange={(e) => handleServiceChange('accommodationProvided', e.target.checked)}
                              className="w-4 h-4 text-orange-600 rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Accommodation & meals provided</span>
                                <span className="text-xs font-bold text-orange-600">
                                  {serviceDetails.accommodationProvided ? '₹2,250/night' : '₹5,500/night'}
                                </span>
                              </div>
                            </div>
                          </label>
                        )}
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Special Excursion Type <span className="text-orange-600">• +₹900 or +₹1,100</span>
                          </label>
                          <select
                            value={serviceDetails.excursionType || ''}
                            onChange={(e) => handleServiceChange('excursionType', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="">Select excursion</option>
                            <option value="Delhi-Agra-Delhi">Delhi-Agra-Delhi (+₹900)</option>
                            <option value="Delhi-Jaipur-Delhi">Delhi-Jaipur-Delhi (+₹900)</option>
                            {EXTRA_ALLOWANCE_EXCURSIONS.map(exc => (
                              <option key={exc} value={exc}>{exc} (+₹1,100)</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Allowances */}
                  <div className="space-y-3">
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={serviceDetails.needsEarlyLateConveyance}
                          onChange={(e) => handleServiceChange('needsEarlyLateConveyance', e.target.checked)}
                          className="w-4 h-4 text-orange-600 rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">Early/Late Hours</span>
                            <span className="text-sm font-bold text-orange-600">
                              +₹{METRO_CITIES.includes(serviceDetails.city) ? '850' : '350'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">Before 7:30 AM or after 8:30 PM</p>
                        </div>
                      </label>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={serviceDetails.needsExtraAllowance}
                          onChange={(e) => handleServiceChange('needsExtraAllowance', e.target.checked)}
                          className="w-4 h-4 text-orange-600 rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">Extra City Allowance</span>
                            <span className="text-sm font-bold text-orange-600">+₹500</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">Report at hotel (applicable for select cities)</p>
                        </div>
                      </label>
                    </div>

                    <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={serviceDetails.needsSpecialAllowance}
                          onChange={(e) => handleServiceChange('needsSpecialAllowance', e.target.checked)}
                          className="w-4 h-4 text-orange-600 rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">Special Event Allowance</span>
                            <span className="text-sm font-bold text-orange-600">+₹400 - ₹500</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">Special tours and attractions</p>
                        </div>
                      </label>
                      
                      {serviceDetails.needsSpecialAllowance && (
                        <select
                          value={serviceDetails.specialAllowanceType || ''}
                          onChange={(e) => handleServiceChange('specialAllowanceType', e.target.value)}
                          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="">Select event</option>
                          <option value="kolkataGangaAarti">Kolkata - Ganga Aarti (₹400)</option>
                          <option value="kolkataVictoriaMemorial">Kolkata - Victoria Memorial (₹400)</option>
                          <option value="mumbaiElephanta">Mumbai - Elephanta Tour (₹500)</option>
                          <option value="varanasiMorningRiver">Varanasi - Morning River (₹400)</option>
                          <option value="varanasiEveningAarti">Varanasi - Evening Aarti (₹500)</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Fee Breakdown (Sticky) */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-4 border-orange-600 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Fee Breakdown
                </h2>

                <div className="space-y-3">
                  {/* Base Fee */}
                  <div className="flex justify-between items-center py-2 border-b border-orange-200">
                    <span className="text-gray-700 font-medium">Base Guide Fee</span>
                    <span className="text-lg font-bold text-gray-900">₹{calculateFees.baseFee.toLocaleString()}</span>
                  </div>

                  {/* Language Allowance */}
                  {calculateFees.languageAllowance > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-orange-200">
                      <span className="text-gray-700 font-medium">Language Allowance</span>
                      <span className="text-lg font-bold text-gray-900">₹{calculateFees.languageAllowance.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Outstation Excursion */}
                  {calculateFees.outstationExcursionAllowance > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-orange-200">
                      <span className="text-gray-700 font-medium">Outstation Excursion</span>
                      <span className="text-lg font-bold text-gray-900">₹{calculateFees.outstationExcursionAllowance.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Outstation Accommodation */}
                  {calculateFees.outstationAccommodationAllowance > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-orange-200">
                      <span className="text-gray-700 font-medium">
                        Accommodation ({serviceDetails.outstationNights} {serviceDetails.outstationNights === 1 ? 'night' : 'nights'})
                      </span>
                      <span className="text-lg font-bold text-gray-900">₹{calculateFees.outstationAccommodationAllowance.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Conveyance */}
                  {calculateFees.conveyanceAllowance > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-orange-200">
                      <span className="text-gray-700 font-medium">Conveyance</span>
                      <span className="text-lg font-bold text-gray-900">₹{calculateFees.conveyanceAllowance.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Extra Allowance */}
                  {calculateFees.extraAllowance > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-orange-200">
                      <span className="text-gray-700 font-medium">Extra Allowance</span>
                      <span className="text-lg font-bold text-gray-900">₹{calculateFees.extraAllowance.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Special Allowance */}
                  {calculateFees.specialAllowance > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-orange-200">
                      <span className="text-gray-700 font-medium">Special Event</span>
                      <span className="text-lg font-bold text-gray-900">₹{calculateFees.specialAllowance.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="mt-6 pt-6 border-t-4 border-orange-600">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total Fee</span>
                    <span className="text-3xl font-extrabold text-orange-600">
                      ₹{calculateFees.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-lg font-bold text-lg hover:from-orange-700 hover:to-red-700 focus:ring-4 focus:ring-orange-300 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                </div>

                {/* Important Notes */}
                <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-orange-200">
                  <h3 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Important Notes
                  </h3>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Fees are non-negotiable per IATO & TGFI agreement</li>
                    <li>• No half-day sightseeing in Delhi (all full-day)</li>
                    <li>• Use Ministry of Tourism recognized guides</li>
                    <li>• Agreement valid Oct 2025 - Sep 2027</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Based on the agreement between Indian Association of Tour Operators (IATO) & Tourist Guides Federation of India (TGFI)
          </p>
          <p className="text-xs text-gray-500 mt-2">
            By submitting this form, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}