"use client";

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchBlogBySlug } from '@/lib/redux/thunks/blog/blogThunks';
import { clearCurrentBlog } from '@/lib/redux/blogSlice'; // Import the clear action

// --- Skeleton Component for Loading State ---
const BlogDetailSkeleton = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
    <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-8 bg-gray-200 rounded w-1/2 mb-8"></div>
    <div className="relative w-full h-80 rounded-xl bg-gray-200 mb-8"></div>
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mt-6"></div>
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
export default function BlogDetailPage() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const slug = params.slug as string;

  const { currentBlog, loading, error } = useSelector((state: RootState) => state.blogs);
  
  useEffect(() => {
    if (slug) {
      dispatch(fetchBlogBySlug(slug));
    }

    // Cleanup function: Clear the current blog when the component unmounts
    // This prevents a flash of old content when navigating between blog posts
    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [dispatch, slug]);

  // Handle 404 case if an error occurs (e.g., blog not found)
  // Note: The thunk's rejection will populate the 'error' state
  if (!loading && error) {
    notFound();
  }

  return (
    <article className="bg-white py-12 sm:py-16">
      {loading ? (
        <BlogDetailSkeleton />
      ) : currentBlog ? (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8 pt-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              {currentBlog.title}
            </h1>
            <div className="flex items-center space-x-4 text-gray-500">
              {currentBlog.author && (
                <div className="flex items-center space-x-2">
                   <Image 
                    src={currentBlog.author.avatar || '/default-avatar.png'} 
                    alt={currentBlog.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="font-medium text-gray-800">{currentBlog.author.name}</span>
                </div>
              )}
              <span>•</span>
              <time dateTime={currentBlog.publishedAt}>{formatDate(currentBlog.publishedAt)}</time>
            </div>
          </header>

          {currentBlog.thumbnail && (
            <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden mb-8 shadow-lg">
              <Image
                src={currentBlog.thumbnail}
                alt={currentBlog.title}
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
          )}

          <div 
            className="prose prose-lg max-w-none prose-indigo"
            dangerouslySetInnerHTML={{ __html: currentBlog.content }} 
          />
          
          {currentBlog.tags && currentBlog.tags.length > 0 && (
            <footer className="mt-12 pt-8 border-t">
              <p className="text-sm font-semibold text-gray-600 mb-3">TAGS:</p>
              <div className="flex flex-wrap gap-2">
                {currentBlog.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </footer>
          )}
        </div>
      ) : (
        // This can be a fallback, though the skeleton usually covers it
        <div className="text-center">Loading...</div>
      )}
    </article>
  );
}