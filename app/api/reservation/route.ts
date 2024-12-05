//  app/api/reservation/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/db'; // Prisma client
import { getSession } from '@/utils/loginUser'; // Session handling utility

// POST method for creating a reservation
export async function POST(req: NextRequest) {
  const { roomNumber, startTime, phoneNumber } = await req.json();

  const session = await getSession();
  if (!session || !session.id) {
    return NextResponse.json({ message: "You need to log in first." }, { status: 401 });
  }

  const startDateTime = new Date(startTime);
  if (isNaN(startDateTime.getTime())) {
    return NextResponse.json({ message: 'Invalid start time format.' }, { status: 400 });
  }

  const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);

  const reservationData = {
    userId: session.id,
    roomNumber: parseInt(roomNumber),
    startTime: startDateTime,
    endTime: endDateTime,
    phoneNumber,
  };

  try {
    const reservation = await prisma.reservation.create({
      data: reservationData,
    });

    return NextResponse.json({ message: 'Reservation successful!', reservation }, { status: 200 });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json({ message: 'Something went wrong. Please try again later.' }, { status: 500 });
  }
}

// // GET method for fetching reservations
// export async function GET(req: NextRequest) {
//   try {
//     const reservations = await prisma.reservation.findMany({
//       where: {
//         endTime: { gte: new Date() },
//       },
//       include: {
//         user: true,
//       },
//     });

//     return NextResponse.json({ reservations });
//   } catch (error) {
//     console.error("Error fetching reservations:", error);
//     return NextResponse.json({ message: 'Failed to fetch reservations.' }, { status: 500 });
//   }
// }

// GET method for fetching all reservations or user-specific reservations
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId'); // Get userId from query params

  let reservations;
  try {
    if (userId) {
      // If userId is provided, fetch only the reservations for that user
      reservations = await prisma.reservation.findMany({
        where: {
          userId: parseInt(userId),
          endTime: { gte: new Date() }, // Ensure the reservation is upcoming
        },
        include: {
          user: true, // Include user details with the reservation
        },
      });
    } else {
      // If no userId is provided, fetch all upcoming reservations
      reservations = await prisma.reservation.findMany({
        where: {
          endTime: { gte: new Date() }, // Ensure the reservation is upcoming
        },
        include: {
          user: true, // Include user details with the reservation
        },
      });
    }

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json({ message: 'Failed to fetch reservations.' }, { status: 500 });
  }
}

// export async function GET(req: NextRequest) {
//   const userId = req.nextUrl.searchParams.get('userId'); // Get userId from query params

//   if (!userId) {
//     return NextResponse.json({ message: "User ID is required." }, { status: 400 });
//   }

//   try {
//     const reservations = await prisma.reservation.findMany({
//       where: {
//         userId: parseInt(userId), // Filter reservations by the logged-in user ID
//         endTime: { gte: new Date() }, // Ensure the reservation is upcoming
//       },
//       include: {
//         user: true, // Include user details with the reservation
//       },
//     });

//     return NextResponse.json({ reservations });
//   } catch (error) {
//     console.error("Error fetching reservations:", error);
//     return NextResponse.json({ message: 'Failed to fetch reservations.' }, { status: 500 });
//   }
// }

export async function PUT(req: NextRequest) {
  const { id } = req.nextUrl.query; // Get the reservation ID from the URL
  const { roomNumber, startTime, phoneNumber } = await req.json();

  // Check if the session is valid
  const session = await getSession();
  if (!session || !session.id) {
    return NextResponse.json({ message: "You need to log in first." }, { status: 401 });
  }

  const startDateTime = new Date(startTime);
  if (isNaN(startDateTime.getTime())) {
    return NextResponse.json({ message: 'Invalid start time format.' }, { status: 400 });
  }

  const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);

  try {
    const updatedReservation = await prisma.reservation.update({
      where: { id: parseInt(id as string) },
      data: {
        roomNumber: parseInt(roomNumber),
        startTime: startDateTime,
        endTime: endDateTime,
        phoneNumber,
      },
    });

    return NextResponse.json({ message: 'Reservation updated successfully!', reservation: updatedReservation }, { status: 200 });
  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json({ message: 'Reservation not found or something went wrong.' }, { status: 404 });
  }
}

export async function DELETE(req: Request) {
  const id = req.url.split("/").pop();

  try {
    await prisma.reservation.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Reservation deleted successfully!" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return NextResponse.json({ error: "Failed to delete reservation." }, { status: 500 });
  }
}