// app/rooms/page.tsx
"use client"; // Ensure this is a client component if you are using hooks

import { useEffect, useState } from 'react';

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Fetch available rooms data here
    const fetchRooms = async () => {
      // Example fetch logic
      const response = await fetch('/api/rooms'); // Replace with your actual API endpoint
      const data = await response.json();
      setRooms(data);
    };

    fetchRooms();
  }, []);

  return (
    <div>
      <h1>Available Rooms</h1>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>{room.name}</li> // Replace with actual room properties
        ))}
      </ul>
    </div>
  );
}
