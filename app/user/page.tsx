// app/user/page.tsx

"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/utils/loginUser"; // Session handling utility
import { FaEdit, FaTrash } from "react-icons/fa"; // For Edit and Trash icons

const UserPage = () => {
  const [user, setUser] = useState<any>(null); // User data
  const [error, setError] = useState<string | null>(null); // Error state
  const [reservations, setReservations] = useState<any[]>([]); // Reservations data
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Step 1: Get the session
        const session = await getSession(); // This will fetch session data from cookies

        if (!session || !session.id) {
          setError("User is not logged in."); // No session, user is not logged in
          return;
        }

        // Step 2: Fetch reservations specific to the logged-in user
        const response = await fetch(`/api/reservation?userId=${session.id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch reservations. Status: ${response.status}`);
        }

        const { reservations } = await response.json(); // Extract reservations from the response

        setReservations(reservations); // Set reservations in state

        // Step 3: Set user data
        setUser({
          name: session.name,
          email: session.email,
          role: session.role,
        });

      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false); // Set loading to false after fetching is complete
      }
    };

    fetchUserData();
  }, []);

  const handleEditReservation = (reservation: any) => {
    console.log("Edit Reservation", reservation);
    // Add your edit logic here
  };

  const handleDeleteReservation = async (reservationId: number) => {
    try {
      const response = await fetch(`/api/reservation/${reservationId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setReservations(reservations.filter(reservation => reservation.id !== reservationId));
      } else {
        throw new Error("Failed to delete reservation.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete reservation.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      style={{
        backgroundImage: "url('/wallpaper-2v.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1>User Info</h1>
      {user ? (
        <div className="text-black">
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>

          <h2>Your Reservations</h2>

          {/* Reservations List */}
          <div className="p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-h-[960px] overflow-y-auto">
            {reservations.length === 0 ? (
              <p className="text-black p-6">No upcoming reservations</p>
            ) : (
              reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="border-gray-200 border-2 rounded-lg shadow-xl p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <h3 className="text-2xl font-black my-4 text-orange-500">Room {reservation.roomNumber}</h3>
                  <p className="text-black">
                    <strong>Start Time:</strong> {new Date(reservation.startTime).toLocaleString()}
                  </p>
                  <p className="text-black">
                    <strong>End Time:</strong> {new Date(reservation.endTime).toLocaleString()}
                  </p>
                  <div className="mt-4 text-black">
                    <p><strong>Reserve by:</strong> {reservation.user ? `${reservation.user.name}` : "Unknown User"}</p>
                  </div>
                  <p className="text-black">
                    <strong>Phone:</strong> {reservation.phoneNumber}
                  </p>

                  <div className="flex space-x-4 mt-4">
                    <button
                      className="text-yellow-500 text-2xl hover:text-orange-400 transition duration-200"
                      onClick={() => handleEditReservation(reservation)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 text-xl hover:text-red-700 transition duration-200"
                      onClick={() => handleDeleteReservation(reservation.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <p>No user data found.</p>
      )}
    </div>
  );
};

export default UserPage;
