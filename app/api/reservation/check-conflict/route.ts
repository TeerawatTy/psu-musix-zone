// app/api/reservation/check-conflict/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/db';

export async function POST(req: NextRequest) {
  const { roomNumber, startTime, endTime } = await req.json();

  const startDateTime = new Date(startTime);
  const endDateTime = new Date(endTime);

  try {
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        roomNumber: parseInt(roomNumber),
        OR: [
          {
            startTime: {
              lt: endDateTime,
            },
            endTime: {
              gt: startDateTime,
            },
          },
        ],
      },
    });

    if (existingReservation) {
      return NextResponse.json({ conflict: true });
    }

    return NextResponse.json({ conflict: false });
  } catch (error) {
    console.error("Error checking conflict:", error);
    return NextResponse.json({ error: "Failed to check conflict." }, { status: 500 });
  }
}
