// utils/session.ts

import { cookies } from "next/headers";
import { decrypt } from "./loginUser";

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;

  try {
    const decodedSession = await decrypt(session); // Decrypt the session data
    return decodedSession;
  } catch (error) {
    console.error("Session decryption failed:", error);
    return null;
  }
}
