# PSU Musix Zone Website 🎵
Welcome to the PSU Musix Zone GitHub repository! This is the official source code for the web platform developed for the University Music Club at PSU, designed to manage music practice room reservations, showcase upcoming events, and provide an interactive user experience for all club members and visitors.

## Features 🧩
✨Login/Registration: Users can sign up and log in to manage their personal profiles and reservations.
✨Room Reservation: A user-friendly interface to reserve practice rooms. It allows users to select the date, time, and room, ensuring no overlaps with other users. Reservations are allowed only during specific hours (8:00 AM - 6:00 PM).
✨Upcoming Events: View and read more about upcoming club events like workshops, concerts, and social gatherings.
✨User Profile Management: Users can view and edit their personal information, and see their upcoming room reservations.
✨Admin Dashboard: Admins can manage user accounts, view all reservations, and make adjustments as needed.

## Technology Stack 🤖
 Frontend: Built using Next.js (React-based framework) for an optimal web experience.
- Backend: Implemented with Next.js API Routes and TypeScript for better type safety and developer experience.
- Database: Prisma ORM connected to a SQLite/PostgreSQL database to store user information, reservations, and event data.
- Authentication: Managed with session-based authentication, ensuring users are logged in before making reservations or editing their profile.
- Calendar Integration: Allows users to select reservation times from an interactive calendar.


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
git clone https://github.com/TeerawatTy/psu-musix-zone.git
cd psu-musix-zone
npm install
npm run dev
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
