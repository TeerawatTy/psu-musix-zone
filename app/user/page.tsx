"use client";

import { useEffect, useState } from "react";
import { getSession, logoutUser } from "@/utils/loginUser"; // Session handling utility
import { FaEdit, FaTrash } from "react-icons/fa"; // For Edit and Trash icons
import EditForm from "../components/EditForm"; // Import the EditForm component

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Reservation {
  id: number;
  roomNumber: string;
  startTime: string;
  endTime: string;
  phoneNumber: string;
}

const UserPage = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [userInfo, setUserInfo] = useState<Partial<UserInfo>>({
    name: "",
    email: "",
  });
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState(""); // Store password for confirmation

  const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<number | null>(
    null
  );
  const [isConfirmEditOpen, setIsConfirmEditOpen] = useState(false); // New state for Edit Confirmation

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        const session = await getSession();
        if (!session || !session.id) {
          setError("User is not logged in.");
          return;
        }

        const response = await fetch(`/api/reservation?userId=${session.id}`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch reservations. Status: ${response.status}`
          );
        }

        const { reservations } = await response.json();
        setReservations(reservations);

        setUser({
          id: session.id,
          name: session.name,
          email: session.email,
          role: session.role || "User",
        });
        setUserInfo({ name: session.name, email: session.email });
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditUserInfo = () => setIsUserEditModalOpen(true);

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleOpenConfirmEdit = () => {
    setIsConfirmEditOpen(true);
  };

  const handleUpdateUserInfo = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userInfo, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update user information.");
        return;
      }

      const updatedUser = await response.json();
      setUser((prev) => ({ ...prev, ...updatedUser }));

      await logoutUser();
      window.location.href = "/login";
    } catch (err) {
      setError("Failed to update user information.");
    }
  };

  const handleEditReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (updatedReservation: Reservation) => {
    setReservations((prev) =>
      prev.map((res) =>
        res.id === updatedReservation.id ? updatedReservation : res
      )
    );
    setIsModalOpen(false);
  };

  const handleFormCancel = () => setIsModalOpen(false);

  const handleOpenConfirmDelete = (reservationId: number) => {
    console.log("Delete button clicked for reservation ID:", reservationId); // Debugging log
    setReservationToDelete(reservationId);
    setIsConfirmDeleteOpen(true);
  };

  const handleCancelDelete = () => {
    setReservationToDelete(null);
    setIsConfirmDeleteOpen(false);
  };

  const handleDeleteReservation = async () => {
    if (reservationToDelete === null) return;

    try {
      const response = await fetch(`/api/reservation/${reservationToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete reservation.");
      }

      setReservations((prev) =>
        prev.filter((res) => res.id !== reservationToDelete)
      );
      setIsConfirmDeleteOpen(false);
    } catch (err) {
      setError("Failed to delete reservation.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      className="w-full min-h-[725px]"
      style={{
        backgroundImage: "url('/wallpaper-2v.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="text-4xl font-bold text-orange-600 py-10 text-center">
        USER INFORMATION
      </h1>

      {user ? (
        <div className="w-full p-6 mx-auto space-y-6 ">
          {/* User Info Section */}
          <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-6 space-y-4 max-w-[480px] mx-auto">
            <div className="flex flex-col px-10">
              <p className="text-lg font-semibold text-gray-800">
                Name: <span className="text-gray-600">{userInfo.name}</span>
              </p>
              <p className="text-lg font-semibold text-gray-800">
                Email: <span className="text-gray-600">{userInfo.email}</span>
              </p>
              <p className="text-lg font-semibold text-gray-800">
                Role: <span className="text-gray-600">{user?.role}</span>
              </p>
              <button
                className="flex gap-5 mt-4 text-2xl text-green-500 hover:text-green-600"
                onClick={handleEditUserInfo}
              >
                <FaEdit />
              </button>
            </div>
          </div>

          {/* Edit User Info Modal */}
          {isUserEditModalOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-[480px]">
                <h3 className="text-2xl font-bold text-orange-600 mb-4 text-center">
                  Edit User Info
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userInfo.name}
                    onChange={handleUserInfoChange}
                    className="text-black w-full p-2 border border-gray-300 rounded-md mb-4"
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleUserInfoChange}
                    className="text-black w-full p-2 border border-gray-300 rounded-md mb-4"
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    placeholder="Enter your current password"
                    onChange={handlePasswordChange}
                    className="text-black w-full p-2 border border-gray-300 rounded-md mb-4"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleOpenConfirmEdit}
                    className="bg-orange-500 font-bold text-white px-4 py-2 rounded-md hover:bg-orange-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsUserEditModalOpen(false)}
                    className="bg-gray-500 font-bold text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Edit Modal */}
          {isConfirmEditOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
                <h3 className="text-xl font-semibold text-orange-600 mb-4">
                  Confirm Changes
                </h3>
                <p className="text-black">Are you sure you want to save the changes?</p>
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={handleUpdateUserInfo}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setIsConfirmEditOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reservations Section */}
          <div>
            <h2 className="text-2xl font-bold text-orange-600 mt-10 text-center">
              Your Reservations
            </h2>

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

            {isConfirmDeleteOpen && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
                  <h3 className="text-xl font-semibold text-orange-600 mb-4">
                    Confirm Deletion
                  </h3>
                  <p className="text-black">Are you sure you want to delete this reservation?</p>
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={handleDeleteReservation}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Yes
                    </button>
                    <button
                      onClick={handleCancelDelete}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Reservations List */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
              {reservations.length === 0 ? (
                <p className="text-center text-gray-500">
                  No upcoming reservations
                </p>
              ) : (
                reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="bg-white bg-opacity-90 border-2 border-gray-300 rounded-lg shadow-md p-4 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                  >
                    <h3 className="text-2xl font-black text-orange-500">
                      Room {reservation.roomNumber}
                    </h3>
                    <p className="text-gray-700 mt-2">
                      <strong>Start Time:</strong>{" "}
                      {new Date(reservation.startTime).toLocaleString()}
                    </p>
                    <p className="text-gray-700 mt-2">
                      <strong>End Time:</strong>{" "}
                      {new Date(reservation.endTime).toLocaleString()}
                    </p>
                    <p className="text-gray-700 mt-2">
                      <strong>Phone:</strong> {reservation.phoneNumber}
                    </p>
                    <div className="flex space-x-4 mt-4">
                      <button
                        className="text-yellow-500 hover:text-yellow-700 text-xl"
                        onClick={() => handleEditReservation(reservation)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 text-xl"
                        onClick={() => handleOpenConfirmDelete(reservation.id)}
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
      ) : (
        <div>User not found</div>
      )}
    </div>
  );
};

export default UserPage;
