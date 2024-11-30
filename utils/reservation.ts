// utils/reservation.ts
import prisma from "@/lib/prisma"; // Ensure prisma client is imported correctly

export async function getUserReservations(userId: number) {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId },
      orderBy: { date: "asc" }, // Sort reservations by date (optional)
    });
    return reservations;
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    throw new Error("Failed to fetch reservations.");
  }
}
