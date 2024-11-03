// app/components/Header.tsx
import React from 'react';
import Navbar from './Navbar';
import Link from 'next/link';

const Header = () => {
  return (
    <header 
    className="text-white p-6 bg-cover bg-center flex flex-col items-center"
      style={{
        backgroundImage: "url('/wallpaper-1.png')",
        backgroundSize: "104%",
      }}
    >
      
      <Link href="/" passHref>
        <img src="/logo-2.png" alt="PSU Musix Zone Logo" className="h-20" /> {/* Logo Image */}
      </Link>

      <Navbar/> {/* Use Navbar component */}
    </header>
  );
};

export default Header;
