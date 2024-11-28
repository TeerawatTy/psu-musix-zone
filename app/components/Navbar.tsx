// app/components/Navbar.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSession, logoutUser } from "../../utils/loginUser";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function fetchSession() {
      const session = await getSession();
      if (session) {
        setUser(session);
        setIsLoggedIn(true);
      }
    }

    fetchSession();
  }, []);

  // Handle user logout
  const handleLogout = async () => {
    await logoutUser();  // Log the user out by deleting the session cookie
    router.push('/login');  // Redirect to login page after logging out
  };

  return (
    <nav className="w-full flex justify-between items-center text-white">
      <h1 className="ml-4">
        <Link href="/">
          <img
            src="https://img.icons8.com/sf-black-filled/64/FFFFFF/home.png"
            alt="Home"
            className="h-10 transition-transform duration-150 ease-in-out hover:scale-125"
          />
        </Link>
      </h1>

      <div className="flex space-x-6">
        <h1 className="text-xl hover:text-orange-500">
          <Link href="/equipment">EQUIPMENT</Link>
        </h1>
        <h1 className="text-xl hover:text-orange-500">
          <Link href="/rooms">PRACTICE ROOM</Link>
        </h1>
        <h1 className="text-xl hover:text-orange-500">
          <Link href="/aboutUs">ABOUT US</Link>
        </h1>
      </div>

      <div className="flex items-center space-x-4 mr-4">
        {isLoggedIn ? (
          <>
            <h1 className="text-xl text-orange-400">Hello, {user.name}</h1>
            <button onClick={handleLogout} className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 48 48">
                <path d="M6 24l18-18 18 18" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
            </button>
          </>
        ) : (
          <Link href="/login" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 48 48">
              <path
                d="M24,4C12.972,4,4,12.972,4,24s8.972,20,20,20s20-8.972,20-20S35.028,4,24,4z M24,13c2.761,0,5,2.239,5,5	c0,2.761-2.239,5-5,5s-5-2.239-5-5C19,15.239,21.239,13,24,13z M33,29.538C33,32.397,29.353,35,24,35s-9-2.603-9-5.462v-0.676	C15,27.834,15.834,27,16.862,27h14.276C32.166,27,33,27.834,33,28.862V29.538z"
                className="fill-white"
              />
            </svg>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
