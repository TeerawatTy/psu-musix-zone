// app/components/ReservationList.tsx

"use client";

import { useEffect, useState } from "react";
import { FaPhoneAlt, FaClock, FaCalendarAlt } from "react-icons/fa"; // Icons for readability
import { useRouter } from "next/navigation"; // For navigation after editing

// Define the Reservation interface for TypeScript
interface Reservation {
  id: number;
  roomNumber: number;
  startTime: string;
  endTime: string;
  phoneNumber: string;
}

const ReservationList = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // To track if the user is an admin
  const router = useRouter();

  // Fetch reservations from the API
  const fetchReservations = async () => {
    try {
      // No userId parameter is passed for the room page
      const response = await fetch("/api/reservation"); // Fetch all reservations (no userId param)
      if (!response.ok) {
        throw new Error("Failed to fetch reservations");
      }
      const data = await response.json();
      const sortedReservations = data.reservations.sort((a: Reservation, b: Reservation) => {
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      });
      setReservations(sortedReservations); // Set the sorted reservations
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Check if the user is an admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.role === "admin") {
      setIsAdmin(true); // Set admin status
    }
    fetchReservations(); // Fetch all reservations when the page loads
  }, []);

  // Handle editing a reservation
  const handleEdit = (id: number) => {
    console.log("Editing reservation with ID:", id);
    // Navigate to the edit page for the reservation
    router.push(`/admin/edit/${id}`);
  };

  // Handle deleting a reservation
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this reservation?");
    if (!confirmDelete) return; // Abort if not confirmed

    try {
      const response = await fetch(`/api/reservation/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setReservations(reservations.filter((reservation) => reservation.id !== id));
        alert("Reservation deleted successfully");
      } else {
        alert("Failed to delete reservation");
      }
    } catch (err) {
      console.error("Error deleting reservation:", err);
      alert("An error occurred while deleting the reservation.");
    }
  };

  return (
    <div className="w-full space-y-6 text-black">
      {/* Loading and error state */}
      {loading && (
        <p className="text-center text-gray-500">Loading reservations...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}
      {reservations.length === 0 && !loading && !error && (
        <p className="text-center text-gray-500">No upcoming reservations.</p>
      )}

      {/* Scrollable reservation list */}
      <div className="p-4 sm:p-6 md:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[960px] overflow-y-auto">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="border-2 border-gray-200 p-6 bg-white rounded-lg shadow-lg flex flex-col space-y-4 transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            <div className="flex justify-between items-center">
              <p className="text-xl sm:text-2xl lg:text-3xl font-black text-orange-500">Room {reservation.roomNumber}</p>
              <div className="flex items-center space-x-2 text-gray-600">
                <FaCalendarAlt className="text-gray-500 text-xl" />
                <span className="font-bold text-xl">
                  {new Date(reservation.startTime).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <FaClock className="text-green-500" />
              <span>
                <strong>Start Time:</strong> {new Date(reservation.startTime).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <FaClock className="text-red-500" />
              <span>
                <strong>End Time:</strong> {new Date(reservation.endTime).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <FaPhoneAlt className="text-blue-500" />
              <span>
                <strong>Phone Number:</strong> {reservation.phoneNumber}
              </span>
            </div>

            {/* Admin Edit and Delete Buttons */}
            {isAdmin && (
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handleEdit(reservation.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(reservation.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationList;
