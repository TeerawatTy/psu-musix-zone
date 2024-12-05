// utils/user.ts


import prisma from '@/lib/prisma'; // Import the Prisma client

// Update user function
export const updateUser = async (id: string, data: { name: string; email: string }) => {
  try {
    return await prisma.user.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Error updating user in DB:", error);
    throw new Error("Failed to update user");
  }
};
