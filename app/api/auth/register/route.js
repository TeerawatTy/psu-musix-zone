import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client'; // Adjust path as necessary

export async function POST(req) {
  const { username, email, password } = await req.json();

  // Hash the password
  const hashedPassword = await hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'USER', // Default role
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'User registration failed' }, { status: 500 });
  }
}
