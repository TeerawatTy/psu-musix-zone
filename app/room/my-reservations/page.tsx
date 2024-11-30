"use client";

import React, { useEffect, useState } from "react";
import { getUserReservations } from "@/utils/reservation"; // Function to get reservations (to be implemented)

const MyReservationsPage = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch reservations from backend
    const fetchReservations = async () => {
      const result = await getUserReservations();

      if (result.success) {
        setReservations(result.reservations);
      } else {
        setError(result.error || "An error occurred while fetching reservations.");
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center">My Reservations</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-6">
        {reservations.length === 0 ? (
          <p>No reservations found.</p>
        ) : (
          <ul>
            {reservations.map((reservation, index) => (
              <li key={index} className="border-b border-gray-300 py-4">
                <div className="flex justify-between">
                  <span>{reservation.room}</span>
                  <span>{reservation.date} at {reservation.time}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyReservationsPage;
