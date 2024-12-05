// app/components/EventCard.tsx

"use client";

import React from "react";

type EventCardProps = {
  event: {
    id: number;
    imgPath: string;
    title: string;
    shortContent: string;
  };
  onClick: (event: any) => void;
};

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  return (
    <div
      className=" bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
      onClick={() => onClick(event)} // Trigger the click event to show full content
    >
      <img src={event.imgPath} alt={event.title} className="w-full max-h-[480px] object-cover" />
      <div className="p-6 space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800">{event.title}</h3>
        <p className="text-xl text-gray-600">{event.shortContent}</p>
      </div>
    </div>
  );
};

export default EventCard;
