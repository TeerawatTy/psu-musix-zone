// room/RoomPageClient.tsx

"use client"; // This is a client-side component

import { useRouter } from "next/navigation"; // Import useRouter for navigation

interface RoomPageClientProps {
  sessionCookie: string | null;
  sessionData: { name: string; email: string } | null;
}

const RoomPageClient: React.FC<RoomPageClientProps> = ({ sessionCookie, sessionData }) => {
  const router = useRouter();

  // Handle the click event to redirect to the login page
  const handleLoginRedirect = () => {
    router.push("/login"); // Redirect to the login page
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-md text-black">
      <h1 className="text-2xl font-bold mb-4">Room Reservations</h1>

      {sessionCookie ? (
        <div>
          <h2 className="text-xl font-semibold">Raw Session Cookie:</h2>
          <p className="break-words mb-4">{sessionCookie}</p>

          {sessionData ? (
            <div>
              <h2 className="text-xl font-semibold">Decoded Session Data:</h2>
              <p>Name: {sessionData.name}</p>
              <p>Email: {sessionData.email}</p>
            </div>
          ) : (
            <p className="text-red-500">Unable to decode session data.</p>
          )}
        </div>
      ) : (
        <div>
          <p className="text-red-500 mb-4">Session cookie not found. Please log in.</p>
          <button
            onClick={handleLoginRedirect} // Handle click event to navigate
            className="text-blue-500"
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomPageClient;
