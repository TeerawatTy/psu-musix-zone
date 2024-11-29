// utils/loginUser.ts
"use server"

import { SignJWT, jwtVerify } from "jose"; 
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";  // Ensure to import your prisma instance
import hashPassword from "../utils/hashPassword";  // Import hashPassword for hashing logic

const secretKey = process.env.SECRET;
const key = new TextEncoder().encode(secretKey);

const TIMEOUT = 300; // 5 minutes default

// Function to encrypt the session data
export async function encrypt(payload: any) {
  console.log("Encrypting session data:", payload);  // Debug log
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TIMEOUT}s`)  // Use 's' for seconds
    .sign(key);
}

// Function to decrypt the session data
export async function decrypt(input: string): Promise<any> {
  console.log("Decrypting session:", input);  // Debug log
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  console.log("Decrypted payload:", payload);  // Debug log
  return payload;
}

// Function to login the user and set session cookie
export async function loginUser(userInput: any, remember: boolean) { 
  const { email, password } = userInput;

  console.log("Login attempt for email:", email);  // Debug log

  let timeout = TIMEOUT; // default to 5 minutes
  if (remember) timeout = 24 * 60 * 60; // 1 day if "remember me" is checked

  try {
    // Validate the user's credentials
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("User not found for email:", email);  // Debug log
      return { error: { message: "User not found" } };
    }

    console.log("User found:", user);  // Debug log

    // Validate password (hash input password and compare with stored hash)
    const inputHash = await hashPassword(password);
    console.log("Input password hash: ", inputHash); // Debug log
    console.log("Stored password hash: ", user.password); // Debug log

    // Compare the hashes directly
    if (inputHash !== user.password) {
      console.log("Incorrect password for email:", email);  // Debug log
      return { error: { message: "Incorrect password" } };
    }

    // Create session data
    const sessionData = { id: user.id, email: user.email, name: user.name };
    console.log("Creating session for user:", sessionData);  // Debug log
    const session = await encrypt(sessionData);

    // Set session cookie
    const expires = new Date(Date.now() + timeout * 1000);
    const cookiesResponse = await cookies(); // Awaiting cookies to handle async correctly
    cookiesResponse.set("session", session, {
      expires, 
      httpOnly: true, // Ensures that the cookie is only accessible via HTTP requests
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "Strict", // Ensures that the cookie is sent only for requests to the same site
    });

    console.log("Session cookie set:", { expires, session });  // Debug log

    return { message: "Login Success" };

  } catch (error) {
    console.error("Error during login:", error);
    return { error: { message: "An error occurred during login" } };
  }
}

// Function to logout the user and delete the session cookie
export async function logoutUser() {
  try {
    const cookiesResponse = await cookies(); // Await cookies to handle async
    cookiesResponse.delete("session");
    console.log("Session cookie deleted");  // Debug log
    return { message: "Logout Success" };
  } catch (error) {
    console.error("Error during logout:", error);
    return { error: { message: "An error occurred during logout" } };
  }
}

// Function to get the session from the cookies
export async function getSession() {
  const cookiesResponse = await cookies();
  const session = cookiesResponse.get("session")?.value;

  console.log("Checking session cookie:", session);  // Debug log

  if (!session) {
    console.log("No session cookie found");  // Debug log
    return null;
  }

  try {
    const { payload } = await jwtVerify(session, key, { algorithms: ["HS256"] });
    console.log("Session payload decoded:", payload);  // Debug log
    return payload; // Return the session data (e.g., { id, email, name })
  } catch (error) {
    console.error("Error verifying session:", error);
    return null;
  }
}
