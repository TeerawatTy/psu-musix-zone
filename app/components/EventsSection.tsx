"use client"

import { useEffect, useState } from "react";

interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

const EventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");

        // Check if response is not OK
        if (!response.ok) {
          throw new Error("Failed to fetch events.");
        }

        const data = await response.json();
        console.log("Fetched events:", data);
        
        if (data && data.length > 0) {
          setEvents(data);
        } else {
          setError("No events found.");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Could not load events.");
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h2>Upcoming Events</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <img src={event.image} alt={event.title} />
              <p>{new Date(event.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventsSection;
