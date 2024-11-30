// app/api/reservation/route.ts
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  // Check if the user is logged in
  const session = await getSession({ req });
  if (!session) {
    return new Response(
      JSON.stringify({ message: "You must be logged in to make a reservation." }),
      { status: 401 }
    );
  }

  const { roomNumber, date, startTime, phoneNumber } = await req.json();

  // Validate inputs
  if (!roomNumber || !date || !startTime || !phoneNumber) {
    return new Response(
      JSON.stringify({ message: "All fields are required." }),
      { status: 400 }
    );
  }

  // Convert date and start time into DateTime
  const startDateTime = new Date(`${date}T${startTime}:00`);
  const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours

  try {
    // Create reservation in the database
    const reservation = await prisma.reservation.create({
      data: {
        userId: session.user.id,
        roomNumber,
        date: startDateTime,
        startTime: startDateTime,
        endTime: endDateTime,
        phoneNumber,
      },
    });

    return new Response(
      JSON.stringify({ message: "Reservation created successfully!", reservation }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error creating reservation", error }),
      { status: 500 }
    );
  }
}
