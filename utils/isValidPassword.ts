// utils/isValidPassword.ts

import bcrypt from 'bcryptjs';

// Compare the plain password with the stored hash
export async function isValidPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Password validation failed");
  }
}
