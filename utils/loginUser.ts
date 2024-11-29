// utils/loginUser.ts

"use server"

import { SignJWT, jwtVerify } from "jose"; 
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";  // Ensure to import your prisma instance
import { isValidPassword } from "@/utils/isValidPassword";  // Correct import of isValidPassword

const secretKey = process.env.SECRET;
const key = new TextEncoder().encode(secretKey);

const TIMEOUT = 300; // 5 minutes default

// Function to encrypt the session data
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TIMEOUT}s`)  // Use 's' for seconds
    .sign(key);
}

// Function to decrypt the session data
export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

// Function to login the user and set session cookie
export async function loginUser(userInput: any, remember: boolean) { 
  const { email, password, id, name } = userInput;

  let timeout = TIMEOUT; // default to 5 minutes
  if (remember) timeout = 24 * 60 * 60; // 1 day if "remember me" is checked

  try {
    // Validate the user's credentials
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: { message: "User not found" } };
    }

    // Validate password
    if (!(await isValidPassword(password, user.password))) {
      return { error: { message: "Incorrect password" } };
    }

    // Create session
    const sessionData = { id, email, name };
    const session = await encrypt(sessionData);

    // Set session cookie
    const expires = new Date(Date.now() + timeout * 1000);
    const cookiesResponse = await cookies(); // Awaiting cookies to handle async correctly
    cookiesResponse.set("session", session, { expires, httpOnly: true });

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
    return { message: "Logout Success" };
  } catch (error) {
    console.error("Error during logout:", error);
    return { error: { message: "An error occurred during logout" } };
  }
}
