// app/components/Header.tsx

"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Link from "next/link";
import { getSession } from "@/utils/loginUser"; // Import the getSession function to retrieve session data

const Header = () => {
  const [isAdmin, setIsAdmin] = useState(false);

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
        <Link href="/" passHref className="flex items-center gap-4 font-bold">
          <img src="/logo-2.png" alt="PSU Musix Zone Logo" className="h-16" />
          <span>PSU MUSIX ZONE</span>
        </Link>
        <div className="hidden md:flex space-x-6">
          {/* {isAdmin && (
            <h1 className="text-xl hover:text-orange-500">
              <Link href="/admin">ADMIN</Link>
            </h1>
          )} */}
          <h1 className="text-xl hover:text-orange-500">
            <Link href="/events">EVENTS</Link>
          </h1>
          <h1 className="text-xl hover:text-orange-500">
            <Link href="/room">PRACTICE ROOM</Link>
          </h1>
          <h1 className="text-xl hover:text-orange-500">
            <Link href="/aboutUs">ABOUT US</Link>
          </h1>
          {/* Conditionally render Admin link if user is admin */}
        </div>
      </div>
      <Navbar />
    </header>
  );
};

export default Header;
