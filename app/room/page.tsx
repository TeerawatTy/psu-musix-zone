"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/utils/loginUser";  // Importing the custom function
import { NextResponse } from "next/server";  // Optional: Use this if you want server-side redirect handling

export default function RoomPage() {
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  // This effect runs when the page is loaded on the client side
  useEffect(() => {
    // Asynchronously get the session cookie on the client side
    const fetchSession = async () => {
      try {
        const sessionData = await getSession(); // Get session data using the utility function
        if (sessionData) {
          setSession(sessionData);  // If session exists, store in state
        } else {
          setError("No session found, please log in.");
        }
      } catch (err) {
        setError("An error occurred while fetching session.");
        console.error("Session fetch error:", err);
      }
    };

    fetchSession();  // Call fetchSession when the page mounts
  }, []);

  return (
    <div>
      <h1>Room Page</h1>

      {/* Show session information if it exists */}
      {session ? (
        <div>
          <h2>Welcome, {session.name}!</h2>
          <p>Email: {session.email}</p>
          <p>Session ID: {session.id}</p>
        </div>
      ) : (
        <div>
          {error ? (
            <p>{error}</p>
          ) : (
            <p>Loading session...</p>
          )}
        </div>
      )}
    </div>
  );
}
