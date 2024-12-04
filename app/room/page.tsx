// app/room/page.tsx

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import ReserveRoomForm from "./form";  // Import the ReserveRoomForm component

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

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-md text-black">
      <h1 className="text-2xl font-bold mb-4">Room Reservations</h1>

      {sessionCookie ? (
        <div>
          <h2 className="text-xl font-semibold">Welcome, {sessionData?.name}</h2>
          <p>Email: {sessionData?.email}</p>

          {/* Render the reservation form */}
          <ReserveRoomForm />
        </div>
      ) : (
        <div>
          <p className="text-red-500 mb-4">Session cookie not found. Please log in.</p>
          <a href="/login" className="text-blue-500">Go to Login</a> {/* Link to login page */}
        </div>
      )}
    </div>
  );
};

export default RoomPage;
