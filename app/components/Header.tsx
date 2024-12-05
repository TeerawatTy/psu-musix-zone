// app/components/Header.tsx

"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Link from "next/link";
import { getSession } from "@/utils/loginUser"; // Import the getSession function to retrieve session data

const Header = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State to handle menu toggle

  // Check if the user is logged in and if they are an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      const session = await getSession(); // Fetch session data (from cookies)
      if (session?.role === "admin") {
        setIsAdmin(true); // If the user is an admin, set the state to true
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <header
      className="text-white p-6 bg-cover bg-center flex flex-col items-center w-full"
      style={{
        backgroundImage: "url('/wallpaper-1.png')",
        backgroundSize: "104%",
      }}
    >
      <div className="flex items-center justify-between w-full px-4">
        {/* Logo */}
        <Link href="/" passHref className="flex items-center gap-4 font-bold">
          <img src="/logo-2.png" alt="PSU Musix Zone Logo" className="h-16" />
          <span>PSU MUSIX ZONE</span>
        </Link>

        {/* Menu for larger screens */}
        <div className="hidden md:flex space-x-6">
          <h1 className="text-xl hover:text-orange-500">
            <Link href="/#events-section">EVENTS</Link>
          </h1>
          <h1 className="text-xl hover:text-orange-500">
            <Link href="/room">PRACTICE ROOM</Link>
          </h1>
          <h1 className="text-xl hover:text-orange-500">
            <Link href="/aboutUs">ABOUT US</Link>
          </h1>
        </div>

        {/* Hamburger Menu for smaller screens */}
        <button
          className="md:hidden flex items-center text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1">
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 w-full bg-black bg-opacity-80 p-4 rounded-lg text-center">
          <h1 className="text-xl hover:text-orange-500 mb-2">
            <Link href="#events-section" onClick={() => setMenuOpen(false)}>
              EVENTS
            </Link>
          </h1>
          <h1 className="text-xl hover:text-orange-500 mb-2">
            <Link href="/room" onClick={() => setMenuOpen(false)}>
              PRACTICE ROOM
            </Link>
          </h1>
          <h1 className="text-xl hover:text-orange-500">
            <Link href="/aboutUs" onClick={() => setMenuOpen(false)}>
              ABOUT US
            </Link>
          </h1>
        </div>
      )}

      <Navbar />
    </header>
  );
};

export default Header;
