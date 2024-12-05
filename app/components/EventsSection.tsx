// app/components/EventsSection.tsx

"use client";

import React, { useState } from "react";
import EventCard from "./EventCard";
import { eventData } from "../data/events"; // Import event data from external file

const EventsSection = () => {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const handleEventClick = (event: any) => {
    setSelectedEvent(event); // Set the clicked event data to display in the modal
  };

  const handleCloseModal = () => {
    setSelectedEvent(null); // Close the modal
  };

  return (
    <div
      id="events-section"
      className="p-8 bg-black"
      style={{
        backgroundImage: "url('/wallpaper-2v.png')",
        backgroundSize: "cover",
      }}
    >
      <h1 className="mt-10 text-6xl text-center text-black font-bold">
        Upcoming Events
      </h1>

      <div className="m-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Display Event Cards */}
        {eventData.map((event) => (
          <EventCard key={event.id} event={event} onClick={handleEventClick} />
        ))}
      </div>

      {/* Modal for showing full event content */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div
            className="relative bg-white rounded-lg p-6 w-80 sm:w-96 lg:w-[960px]"
            style={{
              backgroundImage: "url('/wallpaper-2v.png')",
              backgroundSize: "cover",
            }}
          >
            {/* Close button as 'x' */}
            <button
              className="absolute top-2 right-2 text-black text-opacity-75 hover:text-red-600 text-6xl px-2"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              ×
            </button>

            <h2 className="text-4xl font-bold text-gray-800 my-6 text-center">
              {selectedEvent.title}
            </h2>
            <div className="px-10">
              <img
                src={selectedEvent.imgPath}
                alt={selectedEvent.title}
                className="w-full h-full object-cover rounded-lg mb-4"
              />
            </div>
            <p className="text-gray-600 p-6 text-xl">
              {selectedEvent.fullContent}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsSection;
