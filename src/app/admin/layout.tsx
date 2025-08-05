'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {!isLoginPage && <AdminNavbar />}
        <main>
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
