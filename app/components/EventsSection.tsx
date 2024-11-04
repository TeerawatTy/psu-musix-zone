// app/components/EventsSection.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function EventsSection() {
    return (
        <section
            className="relative flex justify-center h-[960px] text-center w-full"
            style={{
                backgroundImage: 'url("/wallpaper-2.png")',
                backgroundSize: '1920px 960px',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        >
            <div className="container mx-auto mt-10">
                <h2 className="mb-8 text-3xl font-semibold text-center">Upcoming Events</h2>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Event 1 */}
                    <div className="p-6 bg-gray-800 rounded-lg">
                        <Image src="/event-1.jpg" alt="Event 1" width={50} height={50} className="mx-auto mb-4" />
                        <h3 className="mb-2 text-2xl font-semibold text-center">Music Jam Session</h3>
                        <p className="text-center">
                            Join our regular jam sessions with fellow musicians.
                        </p>
                        <Link href="/events/jam-session" className="block mt-4 text-center text-orange-500 hover:underline">
                            Learn More
                        </Link>
                    </div>

                    {/* Event 2 */}
                    <div className="p-6 bg-gray-800 rounded-lg">
                        <Image src="/event-1.jpg" alt="Event 2" width={50} height={50} className="mx-auto mb-4" />
                        <h3 className="mb-2 text-2xl font-semibold text-center">Instrument Workshop</h3>
                        <p className="text-center">
                            Attend workshops to learn and improve your skills.
                        </p>
                        <Link href="/events/workshop" className="block mt-4 text-center text-orange-500 hover:underline">
                            Learn More
                        </Link>
                    </div>

                    {/* Event 3 */}
                    <div className="p-6 bg-gray-800 rounded-lg">
                        <Image src="/event-1.jpg" alt="Event 3" width={50} height={50} className="mx-auto mb-4" />
                        <h3 className="mb-2 text-2xl font-semibold text-center">Annual Music Fest</h3>
                        <p className="text-center">
                            Participate in our annual music festival and showcase your talent.
                        </p>
                        <Link href="/events/music-fest" className="block mt-4 text-center text-orange-500 hover:underline">
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
