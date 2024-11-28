// app/components/EventCard.tsx
import Image from 'next/image';
import Link from 'next/link';

interface EventCardProps {
    imageSrc: string;
    title: string;
    description: string;
    link: string;
}

export default function EventCard({ imageSrc, title, description, link }: EventCardProps) {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105">
            <Image
                src={imageSrc}
                alt={title}
                width={600}
                height={400}
                className="rounded-t-lg mb-4 w-full h-auto"
            />
            <h3 className="mb-2 text-2xl font-semibold text-center text-black">{title}</h3>
            <p className="text-center text-gray-700 mb-4">
                {description}
            </p>
            <Link href={link} className="block mt-4 text-center text-orange-500 hover:underline">
                Learn More
            </Link>
        </div>
    );
}
