import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./utils/loginUser";

// Middleware to protect routes from unauthorized access
export async function middleware(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    // If no session is found, redirect to the login page
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If session exists, allow the request to continue
  return NextResponse.next();
}

// Define which routes should trigger this middleware
export const config = {
  matcher: ['/dashboard', '/profile', '/settings'], // Example protected routes
};
