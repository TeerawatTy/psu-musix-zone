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
      <div className="flex justify-between items-center mb-4">
        {/* Left Side: Logo and Text */}
        <div className="flex items-center space-x-3">
          <img src="logo-2.png" alt="PSU Logo" className="h-28" />
          <h1 className="text-2xl">PSU Musix Zone</h1>
        </div>

        {/* Right Side: Navigation and Social Media Icons */}
        <div className="flex flex-col items-end">
          <nav className="flex space-x-4 mb-2">
            <Link href="/" className="hover:text-orange-500">Home</Link>
            <Link href="/rooms" className="hover:text-orange-500">Rooms</Link>
            <Link href="/equipment" className="hover:text-orange-500">Equipments</Link>
            <Link href="/aboutUs" className="hover:text-orange-500">About Us</Link>
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
      <div className="flex justify-center space-x-6 h-10 mb-4">
        <img src="https://img.icons8.com/ios-filled/50/FFFFFF/guitar.png" alt="item"/>
        <img src="https://img.icons8.com/ios-filled/50/FFFFFF/classic-music.png" alt="item"/>
        <img src="https://img.icons8.com/ios-filled/50/FFFFFF/metronome.png" alt="item" />
        <img src="https://img.icons8.com/ios-filled/50/FFFFFF/guitar-amp.png" alt="item" />
        <img src="https://img.icons8.com/ios-filled/50/FFFFFF/micro.png" alt="item" />
        <img src="https://img.icons8.com/ios-filled/50/FFFFFF/bass-drum.png" alt="item" />
        <img src="https://img.icons8.com/ios-filled/50/FFFFFF/electronic-music.png" alt="item" />
        <img src="https://img.icons8.com/ios-filled/50/FFFFFF/rock-music.png" alt="item" />
        <img src="https://img.icons8.com/ios-filled/50/FFFFFF/xylophone.png" alt="item" />
        <img src="https://img.icons8.com/ios-filled/50/FFFFFF/music-record.png" alt="item" />
        <img src="https://img.icons8.com/ios-filled/50/FFFFFF/cello.png" alt="item" />
        <img src="https://img.icons8.com/ios-filled/50/FFFFFF/saxophone.png" alt="item" />
      </div>

      <p className="text-center mt-4 text-gray-300">© 2024 PSU Musix Zone. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
