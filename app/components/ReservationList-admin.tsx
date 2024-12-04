// components/ReservationList-admin.tsx

import { useEffect, useState } from "react";
import ReservationCard from "./ReservationCard"; // Import the ReservationCard component
import { useRouter } from "next/router"; // For handling page redirection

const ReservationList = () => {
  const [reservations, setReservations] = useState<any[]>([]); // State for storing reservations
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch reservations from the API
  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/reservation");
      if (!response.ok) {
        throw new Error("Failed to fetch reservations");
      }
      const data = await response.json();
      setReservations(data.reservations); // Set reservations state with fetched data
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations(); // Fetch reservations when the component mounts
  }, []);

  // Handle the editing of a reservation
  const handleEdit = (id: number) => {
    console.log("Edit reservation with ID:", id);
    // Redirect to the edit page for that reservation
    router.push(`/admin/edit/${id}`);
  };

  // Handle the deletion of a reservation
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      setLoading(true);
      setError(null); // Clear any previous errors

      try {
        const response = await fetch(`/api/reservation/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete reservation.");
        }

        // Update the state to remove the reservation from the list
        setReservations((prevReservations) =>
          prevReservations.filter((reservation) => reservation.id !== id)
        );

        alert("Reservation deleted successfully!");
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
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

      {/* Reservation List */}
      <div className="grid grid-cols-1 gap-6 max-h-[720px] overflow-y-auto">
        {reservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ReservationList;
