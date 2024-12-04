// components/ReservationCard.tsx

import { FaEdit, FaTrash } from "react-icons/fa";

interface ReservationCardProps {
  reservation: any; // Adjust the type according to your reservation data structure
  onEdit: (id: number) => void; // Callback for editing
  onDelete: (id: number) => void; // Callback for deleting
}

const ReservationCard: React.FC<ReservationCardProps> = ({ reservation, onEdit, onDelete }) => {
  return (
    <div
      key={reservation.id}
      className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center"
    >
      <h3 className="text-xl font-semibold text-gray-800">
        Room {reservation.roomNumber}
      </h3>
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
        {/* Display the user's name and email who reserved */}
        <p>
          <strong>Reserved by:</strong>{" "}
          {reservation.user ? (
            <>
              {reservation.user.name} ({reservation.user.email})
            </>
          ) : (
            <span>Unknown User</span>
          )}
        </p>
      </div>

      <div className="flex space-x-4 mt-4">
        {/* Edit and Delete buttons */}
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={() => onEdit(reservation.id)}
        >
          <FaEdit />
        </button>
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => onDelete(reservation.id)}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default ReservationCard;
