// app/page.tsx


import Image from "next/image";
import Link from "next/link";
import EventsSection from "./components/EventsSection"; // Import the EventsSection

export default function HomePage() {
  return (
    <div className="text-white w-full">
      {/* Main Content with Fixed-Size Background */}
      <div
        className="relative flex flex-col items-center justify-center h-[720px] text-center"
        style={{
          backgroundImage: 'url("/wallpaper-3.png")',
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0"></div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
              Welcome to the <span className="text-orange-500">PSU Musix Zone</span>
            </h1>
            <p className="mt-4 text-lg max-w-md mx-auto">
            Discover the heartbeat of PSU Music Club
            </p>
            <p className="mt-4 text-lg max-w-สห mx-auto">
            your gateway to reserving practice rooms, accessing top-notch equipment, and joining a vibrant community of music enthusiasts.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-6 mt-6">
            <Link
              href="/room"
              className="px-6 py-3 text-2xl font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-500"
            >
              Reserve Rooms
            </Link>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <EventsSection />
    </div>
  );
}

