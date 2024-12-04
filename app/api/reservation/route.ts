import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/db'; // Prisma client
import { getSession } from '@/utils/loginUser'; // Session handling utility

export async function POST(req: NextRequest) {
  // Receive the form data from the request
  const { roomNumber, startTime, phoneNumber } = await req.json();

  // Log the incoming data for debugging
  console.log("Received reservation data:", { roomNumber, startTime, phoneNumber });

  // Validate session
  const session = await getSession();
  if (!session || !session.id) {
    return NextResponse.json({ message: "You need to log in first." }, { status: 401 });
  }

  // Convert the start time string to a Date object
  const startDateTime = new Date(startTime);

  // Validate if the start date is valid
  if (isNaN(startDateTime.getTime())) {
    console.log("Invalid start time format:", { startDateTime });
    return NextResponse.json({ message: 'Invalid start time format.' }, { status: 400 });
  }

  // Automatically calculate end time (2 hours after the start time)
  const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours to start time

  // Prepare the reservation data
  const reservationData = {
    userId: session.id,
    roomNumber: parseInt(roomNumber), // Ensure it's an integer
    startTime: startDateTime,
    endTime: endDateTime,
    phoneNumber,
  };

  // Log the reservation data before creating it
  console.log("Preparing reservation data:", reservationData);

  try {
    // Create the reservation in the database
    const reservation = await prisma.reservation.create({
      data: reservationData,
    });

    // Log the created reservation
    console.log("Created reservation:", reservation);

    // Return a success response with the reservation details
    return NextResponse.json({ message: 'Reservation successful!', reservation }, { status: 200 });
  } catch (error) {
    // Log the error for debugging
    console.error("Error creating reservation:", error);
    return NextResponse.json({ message: 'Something went wrong. Please try again later.' }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
  try {
    // Fetch reservations from the database
    const reservations = await prisma.reservation.findMany({
      where: {
        endTime: { gte: new Date() }, // Fetch upcoming reservations
      },
    });

    // Return the reservations as JSON
    return NextResponse.json({ reservations });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json({ message: 'Failed to fetch reservations.' }, { status: 500 });
  }
}
