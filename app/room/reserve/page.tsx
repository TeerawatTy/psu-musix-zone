"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createReservation } from "@/utils/reservation"; // A function to handle reservation logic (to be implemented)

const ReserveRoomPage = () => {
  const [room, setRoom] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the form fields
    if (!room || !date || !time) {
      setError("All fields are required.");
      return;
    }

    // Call the backend function to create the reservation (implement createReservation in utils)
    const result = await createReservation({ room, date, time });

    if (result.success) {
      setSuccess("Reservation created successfully!");
      router.push("/room/my-reservations"); // Redirect to the user's reservation page after success
    } else {
      setError(result.error || "An error occurred while making the reservation.");
    }
  };

  return (
    <div className="container mx-auto p-6 ">
      <h1 className="text-3xl font-semibold text-center">Reserve a Music Practice Room</h1>
      
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-6 mt-6 max-w-lg mx-auto">
        <div>
          <label htmlFor="room" className="block text-lg">Select Room</label>
          <select
            id="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="text-black w-full p-2 mt-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Room</option>
            <option value="Room 1">Room 1</option>
            <option value="Room 2">Room 2</option>
            <option value="Room 3">Room 3</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="date" className="block text-lg">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-black w-full p-2 mt-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="time" className="block text-lg">Time</label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="text-black w-full p-2 mt-2 border border-gray-300 rounded-md"
          />
        </div>

        <button type="submit" className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
          Reserve Room
        </button>
      </form>
    </div>
  );
};

export default ReserveRoomPage;
