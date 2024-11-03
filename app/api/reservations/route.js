import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client'; // Adjust the path as necessary

export async function POST(req) {
  const { userId, roomId, reservation_date, start_time, end_time } = await req.json();

  try {
    const reservation = await prisma.roomReservation.create({
      data: {
        userId,
        roomId,
        reservation_date,
        start_time,
        end_time,
      },
    });
    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Reservation failed' }, { status: 500 });
  }
}
