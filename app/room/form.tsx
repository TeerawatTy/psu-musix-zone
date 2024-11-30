// app/room/form.tsx

"use client"; // Ensure this file is treated as a Client Component

import { useState } from "react";
import axios from "axios";

const ReserveRoomForm = () => {
  const [roomNumber, setRoomNumber] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roomNumber || !date || !startTime || !phoneNumber) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      const response = await axios.post("/api/reservation", {
        roomNumber,
        date,
        startTime,
        phoneNumber,
      });
      alert(response.data.message); // Show success message
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold">Reserve a Room</h2>
      <div>
        <label className="block text-sm font-semibold">Room Number</label>
        <input
          type="number"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold">Start Time</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold">Phone Number</label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Reserve Room</button>

      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </form>
  );
};

export default ReserveRoomForm;
