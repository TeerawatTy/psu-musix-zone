import React from 'react';
import Navbar from './Navbar';
import Link from 'next/link';

const Header = () => {
  return (
    <header
      className="text-white p-6 bg-cover bg-center flex flex-col items-center w-full"
      style={{
        backgroundImage: "url('/wallpaper-1.png')",
        backgroundSize: "104%",
      }}
    >
      {/* Wrapper for Logo and Center Links */}
      <div className="flex items-center justify-between w-full px-4">

        {/* Logo */}
        <Link href="/" passHref className='flex items-center gap-4 font-bold'>
          <img src="/logo-2.png" alt="PSU Musix Zone Logo" className="h-16" />
          <span>PSU MUSIX ZONE</span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex space-x-6">
          <h1 className="text-xl hover:text-orange-500">
            <Link href="/events">EVENTS</Link>
          </h1>
          <h1 className="text-xl hover:text-orange-500">
            <Link href="/rooms">PRACTICE ROOM</Link>
          </h1>
          <h1 className="text-xl hover:text-orange-500">
            <Link href="/aboutUs">ABOUT US</Link>
          </h1>
        </div>
      </div>

      {/* Navbar Component */}
      <Navbar /> 
    </header>
  );
};

export default Header;
