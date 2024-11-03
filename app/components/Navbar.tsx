// app/components/Navbar.tsx
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="w-screen flex justify-between items-center text-white">
      {/* Home Link on the Left */}
      <h1 className="text-xl ml-4 hover:text-orange-500">
        <Link href="/">Home</Link>
      </h1>

      {/* Center Links */}
      <div className="flex space-x-6">
        <h1 className="text-xl hover:text-orange-500">
          <Link href="/rooms">Rooms</Link>
        </h1>
        <h1 className="text-xl hover:text-orange-500">
          <Link href="/equipment">Equipments</Link>
        </h1>
        <h1 className="text-xl hover:text-orange-500">
          <Link href="/aboutUs">About us</Link>
        </h1>
      </div>

      {/* Login Icon on the Right */}
      <h1 className="text-xl mr-4">
        <Link href="/login" className="flex items-center">
          {/* Human Silhouette Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            viewBox="0 0 48 48"
            className="transition-colors duration-200 ease-in-out" // Add transition for smooth color change
          >
            <path
              d="M24,4C12.972,4,4,12.972,4,24s8.972,20,20,20s20-8.972,20-20S35.028,4,24,4z M24,13c2.761,0,5,2.239,5,5	c0,2.761-2.239,5-5,5s-5-2.239-5-5C19,15.239,21.239,13,24,13z M33,29.538C33,32.397,29.353,35,24,35s-9-2.603-9-5.462v-0.676	C15,27.834,15.834,27,16.862,27h14.276C32.166,27,33,27.834,33,28.862V29.538z"
              className="fill-white hover:fill-orange-500" // Change to orange-500 on hover
            />
          </svg>
        </Link>
      </h1>
    </nav>
  );
};

export default Navbar;
