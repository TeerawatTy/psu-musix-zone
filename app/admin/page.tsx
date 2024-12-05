// app/admin/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/utils/loginUser";
import { FaEdit, FaTrash } from 'react-icons/fa';
import EditForm from '../components/EditForm';
import { avatarIcons } from "@/utils/avatarIcons"; // Importing avatarIcons array

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
          router.push("/"); // Redirect if not an admin
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

      // Re-fetch reservations after deleting
      fetchReservations();
    } catch (err: any) {
      console.error("Error deleting reservation:", err.message);
      setError(err.message || "Something went wrong.");
    }
  };

  const handleEditReservation = (reservation: any) => {
    setSelectedReservation(reservation); // Set the reservation to edit
    setIsModalOpen(true); // Open the modal
  };

  // Handle the form submit in AdminPage
  const handleFormSubmit = async (updatedReservation: any) => {
    const { roomNumber, phoneNumber, startTime, endTime } = updatedReservation;

    const updatedData = {
      roomNumber,
      phoneNumber,
      startTime,
      endTime
    };

    try {
      const response = await fetch(`/api/reservation/${updatedReservation.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update reservation");
      }

      // Close the modal and refresh the reservations list after updating
      setIsModalOpen(false);
      fetchReservations();
    } catch (error) {
      console.error("Error updating reservation:", error);
      setError("Failed to update reservation.");
    }
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
    return <p className="text-center text-white">Loading...</p>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div
      className="p-8 bg-black"
      style={{
        backgroundImage: "url('/wallpaper-0v.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="mt-6 text-4xl text-center text-white font-bold">Welcome Admin</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="flex justify-center space-x-10">
        {/* Total Users Section */}
        <div className="text-center mt-8  p-4 w-72 rounded-lg bg-gray-200">
          <h2 className="text-2xl font-bold text-black mb-2">Total Users</h2>
          <h2 className="text-6xl font-bold text-green-500">{users.length}</h2>
        </div>

        {/* Total Reservations Section */}
        <div className="text-center mt-8 border-2 border-gray-200 p-4 w-72 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-2">Total Reservations</h2>
          <h2 className="text-6xl font-semibold text-orange-500">{reservations.length}</h2>
        </div>
      </div>

      {/* User Cards Section */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {users.length === 0 ? (
          <p className="text-white">No users found</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="w-24 h-24 rounded-full bg-black mb-4 flex justify-center items-center">
                {/* Random avatar from the avatarIcons array */}
                <img
                  src={avatarIcons[Math.floor(Math.random() * avatarIcons.length)]}
                  alt="User Avatar"
                  className="h-16 w-16 object-cover rounded-full"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
              <p className="text-gray-500">{user.email}</p>
              <div className="mt-4">
                <strong className="text-lg text-gray-800">Reservations:</strong>
                <span className="text-gray-600"> {user._count.reservations}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reservations Section */}
      <div className="mt-24">
        <h2 className="text-3xl text-center text-white mb-4">Upcoming Reservations</h2>

        {/* Modal for EditForm */}
        {isModalOpen && selectedReservation && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[480px]">
              <EditForm
                reservation={selectedReservation}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        )}

        {/* Reservations List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.length === 0 ? (
            <p className="text-white p-6">No upcoming reservations</p>
          ) : (
            reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="border-gray-200 border-2 rounded-lg shadow-xl p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <h3 className="text-2xl font-black my-4 text-orange-500">Room {reservation.roomNumber}</h3>
                <p className="text-white">
                  <strong>Start Time:</strong> {new Date(reservation.startTime).toLocaleString()}
                </p>
                <p className="text-white">
                  <strong>End Time:</strong> {new Date(reservation.endTime).toLocaleString()}
                </p>
                <div className="mt-4 text-white">
                  <p><strong>Reserve by:</strong> {reservation.user ? `${reservation.user.name}` : "Unknown User"}</p>
                </div>
                <p className="text-white">
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
    </div>
  );
}
