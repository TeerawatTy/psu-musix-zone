// app/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import EventsSection from './components/EventsSection';

export default function HomePage() {
  return (
    <div className="text-white w-full">
      {/* Main Content with Fixed-Size Background */}
      <div
        className="relative flex flex-col items-center justify-center h-[720px] text-center"
        style={{
          backgroundImage: 'url("/wallpaper-3.png")',
          backgroundSize: '1920px 960px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
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
              Your one-stop destination for music room reservations and equipment rentals.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-6 mt-6">
            <Link href="/room" className="px-6 py-3 text-xl font-semibold text-black bg-orange-500 rounded-lg hover:bg-orange-400">
              Reserve Rooms
            </Link>
            <Link href="/equipment" className="px-6 py-3 text-xl font-semibold text-black bg-gray-200 rounded-lg hover:bg-gray-100">
              Up Coming Events
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
