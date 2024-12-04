// app/room/page.tsx

// app/room/page.tsx

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import prisma from '@/utils/db'; // Ensure to import prisma client correctly
import ReserveRoomForm from "./form";

const RoomPage = async () => {
  const secretKey = process.env.SECRET;
  const key = new TextEncoder().encode(secretKey);
  let sessionCookie = null;
  let sessionData = null;

  // Handle session cookie to get user info
  try {
    const cookieStore = await cookies();
    sessionCookie = cookieStore.get("session")?.value;

    if (sessionCookie) {
      const { payload } = await jwtVerify(sessionCookie, key, { algorithms: ["HS256"] });
      sessionData = payload;
    }
  } catch (error) {
    console.error("Error handling session cookie:", error);
  }

  // Fetch the reservations from the database
  let reservations = [];
  try {
    reservations = await prisma.reservation.findMany({
      where: {
        endTime: { gte: new Date() }, // Fetch upcoming reservations
      },
    });
    console.log("Fetched Reservations:", reservations); // Log reservations data
  } catch (error) {
    console.error("Error fetching reservations:", error);
  }

  return (
    <div className="p-4 max-w-full mx-auto flex gap-8">
      {/* Left Column for Reservation List */}
      <div className="w-1/2">
        <h2 className="text-xl font-semibold mb-4">Upcoming Reservations</h2>
        {reservations.length > 0 ? (
          reservations.map((reservation) => (
            <div key={reservation.id} className="mb-4 p-4 border border-gray-300 rounded-lg shadow-md">
              <p><strong>Room Number:</strong> {reservation.roomNumber}</p>
              <p><strong>Date:</strong> {new Date(reservation.startTime).toLocaleDateString()}</p>
              <p><strong>Start Time:</strong> {new Date(reservation.startTime).toLocaleTimeString()}</p>
              <p><strong>End Time:</strong> {new Date(reservation.endTime).toLocaleTimeString()}</p>
            </div>
          ))
        ) : (
          <p>No upcoming reservations.</p>
        )}
      </div>

      {/* Right Column for Reservation Form */}
      <div className="w-1/2">
        <h1 className="text-2xl font-bold mb-4">Room Reservations</h1>
        {sessionCookie ? (
          <div>
            <h2 className="text-xl font-semibold">Welcome, {sessionData?.name}</h2>
            <ReserveRoomForm />
          </div>
        ) : (
          <div>
            <p className="text-red-500 mb-4">Session cookie not found. Please log in.</p>
            <a href="/login" className="text-blue-500">Go to Login</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomPage;
