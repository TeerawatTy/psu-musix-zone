// app/api/reservation/[id]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Assuming you have a Prisma instance

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    // Ensure that params is awaited correctly
    const { id } = await params;
  
    // Validate the id
    if (!id) {
      return NextResponse.json({ message: 'Reservation ID is required.' }, { status: 400 });
    }
  
    try {
      // Convert id to a number if your database expects it as a number
      const reservationId = Number(id);
  
      if (isNaN(reservationId)) {
        return NextResponse.json({ message: 'Invalid reservation ID.' }, { status: 400 });
      }
  
      // Parse the request body
      const body = await request.json();
      const { roomNumber, phoneNumber, startTime, endTime } = body;
  
      // Update reservation using prisma
      const updatedReservation = await prisma.reservation.update({
        where: { id: reservationId },
        data: { roomNumber, phoneNumber, startTime, endTime },
      });
  
      return NextResponse.json(updatedReservation);
    } catch (error) {
      console.error('Error updating reservation:', error);
      return NextResponse.json({ message: 'Error updating reservation.' }, { status: 500 });
    }
  }
  
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      // Await the params to ensure they're available
      const { id } = params;
  
      // Ensure that the id is valid
      const reservation = await prisma.reservation.findUnique({
        where: { id: parseInt(id) }, // Convert id to integer if it's numeric
      });
  
      if (!reservation) {
        return NextResponse.json({ message: 'Reservation not found' }, { status: 404 });
      }
  
      // Proceed with deleting the reservation
      await prisma.reservation.delete({
        where: { id: parseInt(id) }, // Convert id to integer
      });
  
      return NextResponse.json({ message: 'Reservation deleted successfully' }, { status: 200 });
    } catch (error) {
      console.error("Error deleting reservation:", error);
      return NextResponse.json({ message: 'An error occurred while deleting the reservation' }, { status: 500 });
    } finally {
      await prisma.$disconnect(); // Ensure Prisma client disconnects
    }
  }