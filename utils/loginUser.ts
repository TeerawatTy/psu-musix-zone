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

// Static admin credentials
const ADMIN_CREDENTIALS = {
  email: "admin@mail.com",
  password: "123123", // Store a secure hashed version in production!
  name: "Admin",
  role: "admin",
};

export async function loginUser(userInput: any, remember: boolean) {
  const { email, password } = userInput;

  console.log("Login attempt for email:", email); // Debug log

  let timeout = TIMEOUT; // Default session timeout
  if (remember) timeout = 24 * 60 * 60; // 1 day if "remember me" is checked

  try {
    // Static admin credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      console.log("Static admin user authenticated"); // Debug log

      const sessionData = {
        id: "admin",
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        role: ADMIN_CREDENTIALS.role,
      };
      const session = await encrypt(sessionData);

      const expires = new Date(Date.now() + timeout * 1000);
      const cookiesResponse = await cookies();
      cookiesResponse.set("session", session, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      console.log("Admin session created:", sessionData); // Debug log

      // Return with redirect URL for admin
      return { message: "Admin Login Success", redirectTo: "/admin" };
    }

    // Validate credentials for regular users
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("User not found for email:", email); // Debug log
      return { error: { message: "User not found" } };
    }

    console.log("User found:", user); // Debug log

    // Validate the password using your hashing logic
    const inputHash = await hashPassword(password);
    console.log("Input password hash:", inputHash);
    console.log("Stored password hash:", user.password);

    if (inputHash !== user.password) {
      console.log("Incorrect password for email:", email); // Debug log
      return { error: { message: "Incorrect password" } };
    }

    // Create session data for the user
    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || "user", // Assign default "user" role if not defined
    };
    console.log("Creating session for user:", sessionData); // Debug log
    const session = await encrypt(sessionData);

    const expires = new Date(Date.now() + timeout * 1000);
    const cookiesResponse = await cookies();
    cookiesResponse.set("session", session, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return { message: "Login Success" }; // No redirect for regular users
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

export async function getSession() {
  const cookiesResponse = await cookies();
  const session = cookiesResponse.get("session")?.value;

  console.log("Checking session cookie:", session);  // Debug log

  if (!session) {
    console.log("No session cookie found");  // Debug log
    return null;  // Return null if no session is found
  }

  try {
    const { payload } = await jwtVerify(session, key, { algorithms: ["HS256"] });
    console.log("Session payload decoded:", payload);  // Debug log
    if (payload && payload.id && payload.email) {
      return payload;  // Ensure the payload contains necessary fields before returning
    } else {
      console.error("Invalid session payload:", payload);  // Debug log
      return null;  // Return null if payload is invalid or incomplete
    }
  } catch (error) {
    console.error("Error verifying session:", error);  // Error handling
    return null;  // Return null if session verification fails
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + TIMEOUT * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    // secure: true,   // if https is used
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}


// // ---------------- Best Version ----------------------
// export async function getSession() {
//   const cookiesResponse = await cookies();
//   const session = cookiesResponse.get("session")?.value;

//   console.log("Checking session cookie:", session);  // Debug log

//   if (!session) {
//     console.log("No session cookie found");  // Debug log
//     return null;  // Return null if no session is found
//   }

//   try {
//     const { payload } = await jwtVerify(session, key, { algorithms: ["HS256"] });
//     console.log("Session payload decoded:", payload);  // Debug log
//     return payload;  // Return decoded payload (user data)
//   } catch (error) {
//     console.error("Error verifying session:", error);  // Error handling
//     return null;
//   }
// }


// export async function getSession(token: string) {
//   try {
//     const cookiesResponse = await cookies();
//     const session = token;  // Now we accept the token directly from the client request

//     if (!session) {
//       console.log("No session cookie found");
//       return null;
//     }

//     const { payload } = await jwtVerify(session, key, { algorithms: ["HS256"] });
//     console.log("Session payload decoded:", payload);
//     return payload; // Return decoded payload (user data)
//   } catch (error) {
//     console.error("Error verifying session:", error);
//     return null;
//   }
// }

// // Function to get the session from the cookies
// export async function getSession() {
//   const cookiesResponse = await cookies();
//   const session = cookiesResponse.get("session")?.value;

//   console.log("Checking session cookie:", session);  // Debug log

//   if (!session) {
//     console.log("No session cookie found");  // Debug log
//     return null;
//   }

//   try {
//     const { payload } = await jwtVerify(session, key, { algorithms: ["HS256"] });
//     console.log("Session payload decoded:", payload);  // Debug log
//     return payload; // Return the session data (e.g., { id, email, name })
//   } catch (error) {
//     console.error("Error verifying session:", error);
//     return null;
//   }
// }



// export async function getSession() {
//   try {
//     const cookieStore = cookies();
//     const sessionCookie = cookieStore.get("next-auth.session-token");  // Replace with your actual cookie name
//     if (!sessionCookie) return null;

//     const sessionData = JSON.parse(sessionCookie.value);
//     return sessionData;  // This is your session data (e.g., user info)
//   } catch (err) {
//     console.error("Error getting session:", err);
//     return null;
//   }
// }