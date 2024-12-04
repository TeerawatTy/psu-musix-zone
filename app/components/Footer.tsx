// app/components/Footer.tsx
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer
      className="text-white p-6 bg-cover bg-center"
      style={{
        backgroundImage: "url('/wallpaper-1.png')",
        backgroundSize: "103%",
      }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center b-48">
        {/* Left Side: Logo and Text */}
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <Link href="/" passHref>
            <img src="logo-2.png" alt="PSU Musix Zone Logo" className="h-28" /> {/* Logo Image */}
          </Link>
          <h1 className="text-2xl">PSU Musix Zone</h1>
        </div>

        {/* Right Side: Navigation and Social Media Icons */}
        <div className="flex flex-col items-center md:items-end">
          <nav className="flex flex-col md:flex-row space-x-0 md:space-x-4 mb-2">
            <Link href="/" className="hover:text-orange-500 mb-2 md:mb-0">Home</Link>
            <Link href="/events" className="hover:text-orange-500 mb-2 md:mb-0">Events</Link>
            <Link href="/room" className="hover:text-orange-500 mb-2 md:mb-0">Practice Room</Link>
            <Link href="/aboutUs" className="hover:text-orange-500 mb-2 md:mb-0">About Us</Link>
            <Link href="/login" className="hover:text-orange-500">Login</Link>
          </nav>
          <div className="flex space-x-4">
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src="https://img.icons8.com/ios-filled/50/FFFFFF/facebook-new.png" alt="Facebook" className="h-8" />
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src="https://img.icons8.com/ios-glyphs/50/FFFFFF/instagram-circle.png" alt="Instagram" className="h-8" />
            </Link>
            <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <img src="https://img.icons8.com/ios-filled/50/FFFFFF/youtube-play.png" alt="YouTube" className="h-8" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section for Sponsor Logos */}
      <div className="flex flex-wrap justify-center space-x-4 space-y-2 my-6 h-16">
        <img src="https://img.icons8.com/ios-filled/40/FFFFFF/guitar.png" alt="item" className="h-10 hover:h-11" />
        <img src="https://img.icons8.com/ios-filled/40/FFFFFF/classic-music.png" alt="item" className="h-10 hover:h-11" />
        <img src="https://img.icons8.com/ios-filled/40/FFFFFF/metronome.png" alt="item" className="h-10 hover:h-11" />
        <img src="https://img.icons8.com/ios-filled/40/FFFFFF/guitar-amp.png" alt="item" className="h-10 hover:h-11" />
        <img src="https://img.icons8.com/ios-filled/40/FFFFFF/micro.png" alt="item" className="h-10 hover:h-11" />
        <img src="https://img.icons8.com/ios-filled/40/FFFFFF/bass-drum.png" alt="item" className="h-10 hover:h-11" />
        <img src="https://img.icons8.com/ios-filled/40/FFFFFF/electronic-music.png" alt="item" className="h-10 hover:h-11" />
        <img src="https://img.icons8.com/ios-filled/40/FFFFFF/rock-music.png" alt="item" className="h-10 hover:h-11" />
        <img src="https://img.icons8.com/ios-filled/40/FFFFFF/xylophone.png" alt="item" className="h-10 hover:h-11" />
        <img src="https://img.icons8.com/ios-filled/40/FFFFFF/music-record.png" alt="item" className="h-10 hover:h-11" />
        <img src="https://img.icons8.com/ios-filled/40/FFFFFF/cello.png" alt="item" className="h-10 hover:h-11" />
        <img src="https://img.icons8.com/ios-filled/40/FFFFFF/saxophone.png" alt="item" className="h-10 hover:h-11" />
      </div>


      <p className="text-center mb-2 text-gray-700">© 2024 PSU Musix Zone. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
