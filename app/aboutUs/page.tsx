"use client"; // Add this for client-side rendering

import React, { useState, useEffect } from "react";
import Link from "next/link"; // Make sure to import Link from next/link
import Slider from "react-slick"; // Import Slider from react-slick
import "slick-carousel/slick/slick.css"; // Slider styles
import "slick-carousel/slick/slick-theme.css"; // Slider theme

const AboutUsPage = () => {
  const [isClient, setIsClient] = useState(false);

  // Set the state to true once the component is mounted (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return null or loading state during SSR
  if (!isClient) {
    return null;
  }

  const sliderImages = [
    "/c-1.jpg",
    "/c-2.jpg",
    "/c-3.jpg",
    "/c-4.jpg",
    "/c-5.jpg",
    "/c-6.jpg",
    "/c-7.jpg",
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{
        backgroundImage: 'url("/wallpaper-2v.png")',
        backgroundSize: "100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-orange-500 text-4xl sm:text-5xl md:text-6xl font-bold text-center py-16">
        About Us
      </h1>

      <div className="mx-auto max-w-screen-lg mb-12">
        <Slider {...settings}>
          {sliderImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-[300px] sm:h-[400px] lg:h-[540px] object-cover rounded-xl"
              />
            </div>
          ))}
        </Slider>
      </div>

      <p className="text-gray-700 text-lg sm:text-xl md:text-2xl text-center max-w-6xl mx-auto mb-12">
        Welcome to PSU Musix Zone! We are passionate about music and provide a
        platform for students to explore their musical talents. Connect with us
        through our social media platforms for the latest updates and events!
      </p>

      <div className="px-6 sm:px-12 lg:px-24 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Facebook */}
          <div className="flex flex-col items-center justify-center bg-blue-500 p-6 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all">
            <Link
              href="https://www.facebook.com/psumusiczone"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4"
            >
              <img
                src="https://img.icons8.com/ios-filled/100/FFFFFF/facebook-new.png"
                alt="Facebook"
                className="h-24 sm:h-28 lg:h-32"
              />
            </Link>
            <div className="text-white text-xl sm:text-2xl font-bold text-center">
              Visit our Facebook Page
            </div>
          </div>

          {/* Instagram */}
          <div className="flex flex-col items-center justify-center bg-pink-500 p-6 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all">
            <Link
              href="https://www.instagram.com/psumusiczone/"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4"
            >
              <img
                src="https://img.icons8.com/ios-glyphs/100/FFFFFF/instagram-circle.png"
                alt="Instagram"
                className="h-24 sm:h-28 lg:h-32"
              />
            </Link>
            <div className="text-white text-xl sm:text-2xl font-bold text-center">
              Follow us on Instagram
            </div>
          </div>

          {/* YouTube */}
          <div className="flex flex-col items-center justify-center bg-red-600 p-6 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all">
            <Link
              href="https://www.youtube.com/watch?v=vtv4sZyvx8g&list=PLZLnKeFL2bIoIuFgR9TA1bja09vjUtlIS"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4"
            >
              <img
                src="https://img.icons8.com/ios-filled/100/FFFFFF/youtube-play.png"
                alt="YouTube"
                className="h-24 sm:h-28 lg:h-32"
              />
            </Link>
            <div className="text-white text-xl sm:text-2xl font-bold text-center">
              Subscribe to our YouTube Channel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
