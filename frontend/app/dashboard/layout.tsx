"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import Header from "@/components/layout/dashboard/Header";
import { useAuth } from "@/lib/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, loading, fetchCurrentUser } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for the user only on the initial mount
    fetchCurrentUser().finally(() => {
      setIsVerifying(false); // Verification is complete
    });
  }, [fetchCurrentUser]);

  useEffect(() => {
    // Only redirect if verification is complete and the user is not authenticated
    if (!isVerifying && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isVerifying, router]);

  // Show a loader while verifying, loading, or if the user is not yet authenticated.
  if (isVerifying || loading || !isAuthenticated || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }


  if (loading || !isAuthenticated || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50/50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={user.role} 
      />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          user={user} 
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
