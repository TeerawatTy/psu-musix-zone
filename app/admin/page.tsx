// app/admin/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/utils/loginUser"; 
import { FaEdit, FaTrash } from 'react-icons/fa';
import EditForm from '../components/EditForm'; 

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const session = await getSession();
        if (session?.role === "admin") {
          setIsAdmin(true);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data.users);
    } catch (err: any) {
      console.error("Error fetching users:", err.message);
      setError(err.message || "Something went wrong.");
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/reservation");
      if (!response.ok) throw new Error("Failed to fetch reservations");
      const data = await response.json();
      setReservations(data.reservations);
    } catch (err: any) {
      console.error("Error fetching reservations:", err.message);
      setError(err.message || "Something went wrong.");
    }
  };

  const handleDeleteReservation = async (reservationId: number) => {
    try {
      const response = await fetch(`/api/reservation/${reservationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error("Failed to delete reservation");
      fetchReservations(); // Re-fetch after deleting
    } catch (err: any) {
      console.error("Error deleting reservation:", err.message);
      setError(err.message || "Something went wrong.");
    }
  };

  const handleEditReservation = (reservation: any) => {
    setSelectedReservation(reservation); // Set the reservation to edit
    setIsModalOpen(true); // Open the modal
  };

  const handleFormSubmit = (updatedReservation: any) => {
    console.log("Updated Reservation:", updatedReservation);
    setIsModalOpen(false); // Close the modal
    fetchReservations(); // Refresh the reservation list after updating
  };

  const handleFormCancel = () => {
    setIsModalOpen(false); // Close the modal without saving
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchReservations();
    }
  }, [isAdmin]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="p-6"
    style={{
      backgroundImage: "url('/wallpaper-0v.png')",
      backgroundSize: "100%", // Adjust background size as per your requirement
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}

    >
      <h1 className="mt-6 text-4xl text-center ">Welcome Admin</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div>
        <h2 className="mt-6 text-2xl font-semibold text-center">Total Users</h2>
        <h2 className="mt-6 text-6xl font-semibold text-center text-orange-600">{users.length}</h2>
      </div>

      {/* User cards */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-full bg-gray-200 mb-4">
                {/* User Avatar (you can replace this with an actual avatar if available) */}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
              <p className="text-gray-500">{user.email}</p>

              {/* Display number of reservations */}
              <div className="mt-4">
                <strong className="text-lg text-gray-800">Reservations:</strong>
                <span className="text-gray-600"> {user._count.reservations}</span>
              </div>
            </div>
          ))
        )}
      </div>


      <div className="mt-8">
        <h2 className="text-3xl text-center mb-4">Upcoming Reservations</h2>

        {/* Modal for EditForm */}
        {isModalOpen && selectedReservation && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <EditForm
                reservation={selectedReservation}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.length === 0 ? (
            <p>No upcoming reservations</p>
          ) : (
            reservations.map((reservation) => (
              <div key={reservation.id} className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
                <h3 className="text-xl font-semibold text-gray-800">Room {reservation.roomNumber}</h3>
                <p className="text-gray-500">
                  <strong>Start Time:</strong> {new Date(reservation.startTime).toLocaleString()}
                </p>
                <p className="text-gray-500">
                  <strong>End Time:</strong> {new Date(reservation.endTime).toLocaleString()}
                </p>
                <p className="text-gray-500">
                  <strong>Phone:</strong> {reservation.phoneNumber}
                </p>
                <div className="mt-4 text-gray-600">
                  <p><strong>Reserved by:</strong> {reservation.user ? `${reservation.user.name} (${reservation.user.email})` : "Unknown User"}</p>
                </div>

                <div className="flex space-x-4 mt-4">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleEditReservation(reservation)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
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
    </div>
  );
}
