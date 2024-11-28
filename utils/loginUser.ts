// utils/loginUser.ts

"use server"

import { SignJWT, jwtVerify } from "jose"; 
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.SECRET;
const key = new TextEncoder().encode(secretKey);

// Default session expiration timeout in seconds (5 minutes = 300 seconds)
const TIMEOUT = 300;

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TIMEOUT)  // Set expiration time
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    // Check if the error is related to the token being expired
    if (error.code === 'ERR_JWT_EXPIRED') {
      console.error("JWT expired:", error);
      return null;  // Return null to signify session expiration
    }

    // Log and rethrow for any other verification errors
    console.error("JWT verification error:", error);
    throw error;  // Rethrow the error if not expired
  }
}

export async function loginUser(userInput: any, remember: boolean) { 
  const { id, email, name } = userInput; 

  let timeout = TIMEOUT; // Default to 5 minutes
  if (remember) {
    timeout = 24 * 60 * 60; // Set to 24 hours if "remember me" is enabled
  }

  // Create the session with the appropriate expiration time
  const expires = new Date(Date.now() + timeout * 1000); // Convert seconds to milliseconds
  const session = await encrypt({ id, email, name, expires });

  // Use `await` for `cookies()` as it is asynchronous
  const cookieStore = await cookies();
  cookieStore.set("session", session, { expires, httpOnly: true });

  return { message: "Login Success" };
}

export async function logoutUser() {
  // Destroy the session cookie
  const cookieStore = await cookies();
  cookieStore.delete('session');
  return { message: "Logout Success" };
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;

  // Decrypt session, and if expired, return null
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return;

  // Refresh the session to prevent expiration
  const parsed = await decrypt(session);
  if (!parsed) return;  // If session is expired or invalid, don't proceed
  
  parsed.expires = new Date(Date.now() + TIMEOUT * 1000); // Reset expiration based on the timeout
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
