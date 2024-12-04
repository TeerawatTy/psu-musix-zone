// app/api/reservation/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reservationName, roomNumber, date, startTime, phoneNumber, checkIn, checkOut } = await req.json();

    // You would typically store this data in a database here
    // For demonstration purposes, we're just logging it to the console
    console.log("Reservation Details:", {
      reservationName,
      roomNumber,
      date,
      startTime,
      phoneNumber,
      checkIn,
      checkOut,
    });

    // You could implement your DB logic here to save the reservation

    return NextResponse.json({ message: "Room reserved successfully!" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to reserve the room." }, { status: 500 });
  }
}
