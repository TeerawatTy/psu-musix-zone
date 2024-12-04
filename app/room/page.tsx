// app/room/page.tsx

import { cookies } from "next/headers"; // Use cookies from the server-side
import { jwtVerify } from "jose";
import prisma from "@/utils/db"; // Ensure to import prisma client correctly
import ReserveRoomForm from "./form";
import ReservationList from "../components/ReservationList"; // Import the ReservationList component
import Link from "next/link";

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
      orderBy: {
        startTime: 'asc', // Sort by startTime in ascending order
      },
    });
    console.log("Fetched Reservations:", reservations); // Log reservations data
  } catch (error) {
    console.error("Error fetching reservations:", error);
  }

  // Pass data to client component
  return (
    <RoomPageClient sessionData={sessionData} reservations={reservations} />
  );
};

const RoomPageClient = ({ sessionData, reservations }: { sessionData: any, reservations: any }) => {
  return (
    <div
      className="p-8 max-w-full mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8"
      style={{
        backgroundImage: "url('/wallpaper-2v.png')",
        backgroundSize: "100%", // Adjust background size as per your requirement
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Left Column for Reservation List */}
      <div className="bg-white bg-opacity-50 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Upcoming Reservations</h2>
        <ReservationList reservations={reservations} />
      </div>

      {/* Right Column for Reservation Form */}
      <div className="bg-white bg-opacity-50 p-6 rounded-lg shadow-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 mt-6 text-center">Practice Room Reservations</h1>
        {sessionData ? (
          <div>
            <h2 className="text-2xl text-orange-500  mt-2 mb-10 text-center">Welcome!, {sessionData?.name}</h2>
            <ReserveRoomForm />
          </div>
        ) : (
          <div >
            <p className="text-red-500 my-4 text-center">
              Session cookie not found. Please log in to make a reservation.
            </p>
            <Link href="/login" className="flex items-center justify-center mt-10">
              <span className="text-black font-bold px-6 py-2 border-2 border-black rounded-md hover:bg-orange-500 hover:text-white hover:border-white transition duration-200">Login</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomPage;
