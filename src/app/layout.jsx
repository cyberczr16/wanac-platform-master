"use client"; // Enable client-side rendering for this file

import './globals.css';
import './fonts.css'; // Add this line to import the fonts
import React from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname for route detection
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Get the current route
  const excludedPaths = [
    '/login',
    '/signup',
    '/dashboard',
    '/dashboard/coaches',
    '/dashboard/admin',
    '/onboarding',
    '/life-score',
  ]; // Define paths where Navbar and Footer should be excluded

  const shouldExclude = excludedPaths.some((path) => pathname.startsWith(path)); // Check if the current path matches any excluded path

  return (
    <html lang="en" className="bg-[#002147] text-gray-800">
      <head>
        {/* You can add additional meta tags here if needed */}
      </head>
      <body>
        {!shouldExclude && <Navbar />} {/* Render Navbar only if not excluded */}
        <main className="p-4">{children}</main>
        {!shouldExclude && <Footer />} {/* Render Footer only if not excluded */}
      </body>
    </html>
  );
}
