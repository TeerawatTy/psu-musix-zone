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
      const response = await fetch("/api/reservation");
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
    fetchReservations(); // Fetch reservations after user check
  }, []);

  // Handle editing a reservation
  const handleEdit = (id: number) => {
    console.log("Editing reservation with ID:", id);
    // You can either navigate to an edit page or show a modal here
    router.push(`/admin/edit/${id}`); // Assuming you have an edit page
  };

  // Handle deleting a reservation
  const handleDelete = async (id: number) => {
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
    }
  };

  return (
    <div className="w-full space-y-6 text-black">
      {/* Loading and error state */}
      {loading && <p className="text-center text-gray-500">Loading reservations...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {reservations.length === 0 && !loading && !error && (
        <p className="text-center text-gray-500">No upcoming reservations.</p>
      )}

      {/* Scrollable reservation list */}
      <div className="grid grid-cols-1 gap-6 max-h-[960px] overflow-y-auto">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="p-6 bg-white rounded-lg shadow-lg flex flex-col space-y-4 transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            <div className="flex justify-between items-center">
              <p className="text-2xl font-semibold text-gray-800">Room {reservation.roomNumber}</p>
              <p className="text-gray-500 text-lg">{new Date(reservation.startTime).toLocaleDateString()}</p>
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
            <div className="flex items-center space-x-2 text-gray-600">
              <FaCalendarAlt className="text-orange-500" />
              <span>
                <strong>Reservation Date:</strong> {new Date(reservation.startTime).toLocaleDateString()}
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
