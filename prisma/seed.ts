import prisma from '../utils/db';

async function main() {
  // Create users
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: "hashed_password", // Replace with hashed password
      role: "admin",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Regular User",
      email: "user@example.com",
      password: "hashed_password", // Replace with hashed password
    },
  });

  // Create reservations
  await prisma.reservation.createMany({
    data: [
      {
        userId: user.id,
        roomName: "Practice Room A",
        date: new Date("2024-12-01T10:00:00Z"),
      },
      {
        userId: user.id,
        roomName: "Practice Room B",
        date: new Date("2024-12-02T14:00:00Z"),
        approved: true,
      },
    ],
  });

  // Create events
  await prisma.event.createMany({
    data: [
      {
        title: "Music Club Annual Meet",
        content: "Join us for our annual gathering to celebrate music!",
        date: new Date("2024-12-15T18:00:00Z"),
      },
      {
        title: "Open Mic Night",
        content: "Show off your skills at our monthly open mic night.",
        date: new Date("2024-12-20T19:00:00Z"),
      },
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
