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

// GET method for fetching reservations
export async function GET(req: NextRequest) {
  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        endTime: { gte: new Date() },
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json({ message: 'Failed to fetch reservations.' }, { status: 500 });
  }
}

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

const handleDelete = async (id: number) => {
  setLoading(true); // Optionally show loading state
  try {
    const response = await fetch(`/api/reservation/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error deleting reservation');
    }

    // Successfully deleted the reservation
    alert("Reservation deleted successfully!");
    onDelete(id); // Trigger the parent's delete callback (to update UI)
  } catch (error) {
    console.error("Error deleting reservation:", error);
    setError("An unexpected error occurred. Please try again later.");
  } finally {
    setLoading(false);
  }
};
