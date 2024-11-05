// auth/register/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../../node_modules/.prisma/client'; // Adjust the import based on your structure

export async function POST(request) {
    const { username, email, password } = await request.json();

    // Hash the password before saving (consider using bcrypt)
    // const hashedPassword = await hash(password, 10); 

    try {
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password, // use hashedPassword here
                role: 'USER', // Default role
            },
        });
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
