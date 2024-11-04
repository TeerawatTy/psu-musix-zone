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
        <div className="p-4 bg-gray-800 rounded-lg">
            <Image
                src={imageSrc}
                alt={title}
                width={600}
                height={600}
                className="rounded-t-lg mb-4 w-full h-auto"
            />
            <h3 className="mb-2 text-2xl font-semibold text-center text-white">{title}</h3>
            <p className="text-center text-gray-300">
                {description}
            </p>
            <Link href={link} className="block mt-4 text-center text-orange-500 hover:underline">
                Learn More
            </Link>
        </div>
    );
}
