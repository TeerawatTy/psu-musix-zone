// room/page.tsx

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const RoomPage = async () => {
  const secretKey = process.env.SECRET;
  const key = new TextEncoder().encode(secretKey);
  let sessionCookie = null;
  let sessionData = null;

  try {
    // Fetch the raw session cookie (async call)
    const cookieStore = await cookies(); // Await the cookies() API
    sessionCookie = cookieStore.get("session")?.value;

    if (sessionCookie) {
      // Decode the session cookie if present
      const { payload } = await jwtVerify(sessionCookie, key, { algorithms: ["HS256"] });
      sessionData = payload; // Extracted session data (name, email, etc.)
    }
  } catch (error) {
    console.error("Error handling session cookie:", error);
  }

  // Redirect user to login page if no session cookie is found
  if (!sessionCookie) {
    return (
      <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-md text-black">
        <p className="text-red-500 mb-4">Session cookie not found. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-md text-black">
      <h1 className="text-2xl font-bold mb-4">Room Reservations</h1>

      {sessionCookie ? (
        <div>
          <h2 className="text-xl font-semibold">Raw Session Cookie:</h2>
          <p className="break-words mb-4">{sessionCookie}</p>

          {sessionData ? (
            <div>
              <h2 className="text-xl font-semibold">Decoded Session Data:</h2>
              <p>Name: {sessionData.name}</p>
              <p>Email: {sessionData.email}</p>
            </div>
          ) : (
            <p className="text-red-500">Unable to decode session data.</p>
          )}
        </div>
      ) : (
        <p className="text-red-500">No session cookie found. Redirecting...</p>
      )}
    </div>
  );
};

export default RoomPage;
