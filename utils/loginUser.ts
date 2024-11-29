// utils/loginUser.ts

"use server"

import { SignJWT, jwtVerify } from "jose"; 
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.SECRET as string; // Ensure SECRET is defined in .env
const key = new TextEncoder().encode(secretKey);

const TIMEOUT = 300; // Timeout in seconds (5 minutes default)

export async function encrypt(payload: any) {
  // Encrypt the payload into a JWT token
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt() // Issue the token immediately
    .setExpirationTime(`${TIMEOUT}s`) // Set the expiration time (default 5 minutes)
    .sign(key); // Sign with the secret key
}

export async function decrypt(input: string): Promise<any> {
  try {
    // Decrypt the JWT token and return the payload
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"], // Only allow HS256 for security reasons
    });
    return payload; // Return the decrypted payload
  } catch (error) {
    // Handle any errors (e.g., invalid token, expired token)
    throw new Error("Invalid or expired session token");
  }
}

export async function loginUser(userInput: any, remember: boolean) { 
  const { id, email, name } = userInput; 

  // Set a timeout based on whether the user wants to be remembered or not
  let timeout = TIMEOUT; // default 5 minutes
  if (remember) timeout = 24 * 60 * 60; // 24 hours if "remember me" is true

  // Create the session (encrypt the user data)
  const expires = new Date(Date.now() + timeout * 1000);
  const session = await encrypt({ id, email, name, expires });

  // Save the session in a cookie with an expiration time
  cookies().set("session", session, { expires, httpOnly: true });
  return { message: "Login Success" };
}

export async function logoutUser() {
  // Destroy the session by deleting the session cookie
  cookies().delete('session'); 
  return { message: "Logout Success" };
}

export async function getSession() {
  // Retrieve and decrypt the session cookie value
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session); // Return the decrypted session (user data)
}

export async function updateSession(request: NextRequest) {
  // Refresh the session expiration time by re-signing it
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Decrypt the current session
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + TIMEOUT * 1000); // Refresh the expiration time

  // Prepare the response with the updated session
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed), // Re-encrypt the updated session data
    httpOnly: true,
    expires: parsed.expires, // Set the new expiration time
  });
  return res;
}
