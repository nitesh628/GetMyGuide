"use client";

import { useState, useEffect } from "react";
import TourForm from "./components/TourForm";
import TourCard from "./components/TourCard";
import { TourData } from "./types/tour";
import { Compass, Trash2 } from "lucide-react";

export default function ServicesPage() {
  const [tours, setTours] = useState<TourData[]>([]);

  const handleSubmit = (tourData: TourData) => {
    setTours((prev) => [...prev, tourData]);
  };

  const handleDelete = (tourId: string) => {
    setTours((prev) => prev.filter((tour) => tour.id !== tourId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-600 to-pink-600 flex items-center justify-center">
              <Compass className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Tour Services
              </h1>
              <p className="text-sm text-slate-600">
                Create and manage your amazing tours
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Form Section */}
        <section className="mb-16">
          <TourForm onSubmit={handleSubmit} />
        </section>

        {/* Tours Display Section */}
        {tours.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                  Your Tours
                </h2>
                <p className="text-slate-600">
                  You have {tours.length} tour{tours.length !== 1 ? "s" : ""}{" "}
                  created
                </p>
              </div>
            </div>

            {/* Tours Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 place-items-center">
              {tours.map((tour) => (
                <div key={tour.id} className="relative group">
                  <TourCard
                    name={tour.name}
                    description={tour.description}
                    location={tour.location}
                    images={tour.images}
                  />

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(tour.id)}
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-semibold transform hover:scale-105"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {tours.length === 0 && (
          <section className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <Compass className="w-16 h-16 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              No Tours Yet
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Start creating your first tour using the form above. Share your
              amazing destinations with the world!
            </p>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-slate-600 text-sm">
          <p>© 2025 Tour Services. Create memorable experiences.</p>
        </div>
      </footer>
    </div>
  );
}
