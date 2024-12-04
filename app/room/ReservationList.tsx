// room/ReservationList.tsx

import { useEffect, useState } from 'react';

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

  useEffect(() => {
    // Fetch reservations from the API
    const fetchReservations = async () => {
      try {
        const response = await fetch('/api/reservation'); // Make sure your API route exists
        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }
        const data = await response.json();
        setReservations(data.reservations);
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl font-bold mb-4">Upcoming Reservations</h2>

      {/* Display loading state */}
      {loading && <p>Loading reservations...</p>}

      {/* Display error state */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display no reservations message */}
      {reservations.length === 0 && !loading && !error && (
        <p>No upcoming reservations.</p>
      )}

      {/* Display reservation list */}
      <div className="grid grid-cols-1 gap-4">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="p-4 bg-white rounded-lg shadow-md flex flex-col space-y-2"
          >
            <p className="text-lg font-semibold">Room {reservation.roomNumber}</p>
            <p><strong>Date:</strong> {new Date(reservation.startTime).toLocaleDateString()}</p>
            <p><strong>Start Time:</strong> {new Date(reservation.startTime).toLocaleTimeString()}</p>
            <p><strong>End Time:</strong> {new Date(reservation.endTime).toLocaleTimeString()}</p>
            <p><strong>Phone Number:</strong> {reservation.phoneNumber}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationList;
