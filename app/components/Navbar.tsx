// Mark this file as a Client Component by adding "use client"


"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSession, logoutUser } from "@/utils/loginUser"; // Import logoutUser to handle logging out

const Navbar = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Fetch the session on client side
    const fetchSession = async () => {
      const session = await getSession(); // Fetch session data
      setUser(session); // Update user state with the fetched session data
    };

    fetchSession(); // Call the function to load the session
  }, []); // Empty dependency array to run only once after the component mounts

  // Handle Logout
  const handleLogout = async () => {
    await logoutUser(); // Call the logout function to clear the session
    window.location.href = "/"; // Redirect to the homepage after logging out
  };

  return (
    <nav className="w-full flex justify-between items-center text-white py-4 px-6">
      {/* Left Section: Home Icon and Username */}
      <div className="flex items-center pl-6">
        {user && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            viewBox="0 0 48 48"
            className="transition-transform duration-150 ease-in-out hover:scale-125"
          >
            <path
              d="M24,4C12.972,4,4,12.972,4,24s8.972,20,20,20s20-8.972,20-20S35.028,4,24,4z M24,13c2.761,0,5,2.239,5,5	c0,2.761-2.239,5-5,5s-5-2.239-5-5C19,15.239,21.239,13,24,13z M33,29.538C33,32.397,29.353,35,24,35s-9-2.603-9-5.462v-0.676	C15,27.834,15.834,27,16.862,27h14.276C32.166,27,33,27.834,33,28.862V29.538z"
              className="fill-white"
            />
          </svg>
        )}
        {user && (
          <span className="text-xl text-white ml-4">Hello, {user.name}</span> // Display username if user is logged in
        )}
      </div>

      {/* Right Section: Login Button, Logout Button */}
      <div className="flex items-center gap-4">
        {user ? (
          // If user is logged in, show the logout button
          <button
            onClick={handleLogout}
            className="text-white px-4 py-2 border border-white rounded-md hover:bg-orange-500 transition duration-200"
          >
            Logout
          </button>
        ) : (
          // If the user is not logged in, show the login button
          <Link href="/login" className="flex items-center">
            <span className="text-white px-6 py-2 border border-white rounded-md hover:bg-orange-500 transition duration-200">Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
