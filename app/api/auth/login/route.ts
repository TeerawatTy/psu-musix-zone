// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/db'; // Import prisma only once from the correct path
import { loginUser } from '@/utils/loginUser'; // Import loginUser only once from the correct path
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"), // More descriptive error message
});

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request body
    const { email, password } = await req.json();

    // Validate the request data
    const parsedData = loginSchema.parse({ email, password });

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email: parsedData.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check if the password is correct (you can use bcrypt.compare here)
    const isValid = await loginUser(parsedData.password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Return a success response (you can generate a token or session here)
    return NextResponse.json({ message: 'Login successful', user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Error logging in:', error);

    if (error instanceof z.ZodError) {
      // Handle specific Zod validation error
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }

    // General error handling
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
