"use client";

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchBlogs } from '@/lib/redux/thunks/blog/blogThunks';
import { Blog } from '@/lib/data'; // Assuming this type is defined

// --- Skeleton Component for Loading State ---
const CardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col animate-pulse">
    <div className="relative w-full h-48 bg-gray-200"></div>
    <div className="p-6 flex flex-col flex-grow">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="mt-auto pt-4 border-t border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

// --- Helper Function ---
const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// --- Main Page Component ---
export default function BlogListPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, loading, error } = useSelector((state: RootState) => state.blogs);

  // Fetch blogs when the component mounts
  useEffect(() => {
    // Fetch only published blogs for the public-facing page
    dispatch(fetchBlogs({ limit: 100 }));
  }, [dispatch]);

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Our Latest Articles
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
            Insights, stories, and advice to help you on your journey.
          </p>
        </div>

        {/* Content Area */}
        <div>
          {loading ? (
            // --- Loading State ---
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : error ? (
            // --- Error State ---
            <div className="text-center py-20 text-red-600">
              <h2 className="text-2xl font-semibold">An Error Occurred</h2>
              <p>{error}</p>
            </div>
          ) : blogs.length > 0 ? (
            // --- Success State ---
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog: Blog) => (
                <Link href={`/blogs/${blog.slug}`} key={blog._id}>
                  <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out h-full flex flex-col">
                    <div className="relative w-full h-48">
                      <Image
                        src={blog.thumbnail || '/placeholder-image.png'}
                        alt={blog.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h2 className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-200 leading-tight">
                        {blog.title}
                      </h2>
                      <p className="mt-auto pt-4 border-t border-gray-100 text-sm text-gray-400">
                        Published on {formatDate(blog.publishedAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            // --- Empty State ---
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold text-gray-700">No Articles Found</h2>
              <p className="mt-2 text-gray-500">Please check back later for new content.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}