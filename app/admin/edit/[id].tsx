import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import EditForm from "../../../components/EditForm"; // Assuming you have this component

const EditReservation = () => {
  const router = useRouter();
  const { id } = router.query; // Get the reservation ID from the URL

  const [reservation, setReservation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchReservation = async () => {
        try {
          const response = await fetch(`/api/reservation/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch reservation");
          }
          const data = await response.json();
          setReservation(data.reservation); // Set reservation data to the state
        } catch (err: any) {
          setError(err.message || "Failed to load reservation.");
        } finally {
          setLoading(false);
        }
      };

      fetchReservation();
    }
  }, [id]);

  const handleSubmit = (updatedReservation: any) => {
    // Optionally update the reservation list on success, or redirect
    console.log("Updated Reservation:", updatedReservation);
    // After successful update, you could redirect back to the list page:
    router.push("/admin/reservations");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Edit Reservation</h1>
      <EditForm
        reservation={reservation}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/admin/reservations")} // Redirect to the reservation list
      />
    </div>
  );
};

export default EditReservation;
