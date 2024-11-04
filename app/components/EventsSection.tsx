// app/components/EventsSection.tsx
import EventCard from './EventCard';

export default function EventsSection() {
    return (
        <section
            className="relative flex justify-center py-12 text-center w-full"
            style={{
                backgroundImage: 'url("/wallpaper-2.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="container mx-auto mt-10 px-4">
                <h2 className="my-8 text-5xl font-black text-center text-orange-900">Upcoming Events</h2>

                <div className="mt-4 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Event 1 */}
                    <EventCard
                        imageSrc="/event-1.jpg"
                        title="Music Jam Session"
                        description="Join our regular jam sessions with fellow musicians."
                        link="/events/jam-session"
                    />

                    {/* Event 2 */}
                    <EventCard
                        imageSrc="/event-2.jpg"
                        title="Instrument Workshop"
                        description="Attend workshops to learn and improve your skills."
                        link="/events/workshop"
                    />

                    {/* Event 3 */}
                    <EventCard
                        imageSrc="/event-3.jpg"
                        title="Annual Music Fest"
                        description="Participate in our annual music festival and showcase your talent."
                        link="/events/music-fest"
                    />
                </div>
            </div>
        </section>
    );
}
