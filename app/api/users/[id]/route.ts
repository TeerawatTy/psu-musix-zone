// app/api/users/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/db'; // Adjust your database connection
import hashPassword from '@/utils/hashPassword'; // Assuming you have a utility for password hashing

export async function PUT(req: NextRequest) {
  try {
    // Extract the ID from the URL
    const { pathname } = req.nextUrl;
    const id = pathname.split('/').pop(); // Extract ID from URL path
    console.log('Request URL:', pathname);
    console.log('Extracted ID:', id);

    // Parse the request body
    const body = await req.json();
    console.log('Request body:', body); // Log the raw body

    // Check if the body has required fields: name, email, and password
    if (!body || !body.name || !body.email || !body.password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { name, email, password } = body;

    // Ensure the user exists in the database
    const user = await prisma.user.findUnique({ where: { id: parseInt(id as string, 10) } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Hash the password if it was provided in the request
    const hashedPassword = await hashPassword(password); // Hash the password

    // Update the user, making sure to not send null values
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id as string, 10) },
      data: { 
        name: name, 
        email: email, 
        password: hashedPassword // Only update the password if it was provided
      },
    });

    console.log('Updated user:', updatedUser); // Log the updated user for debugging

    return NextResponse.json(updatedUser); // Return the updated user object

  } catch (err) {
    console.error('Error during update:', err);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}



// import { NextRequest, NextResponse } from 'next/server';
// import prisma from '@/lib/prisma'; // Adjust the import as needed

// export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
//     try {
//       const { id } = await params;
//       const userId = parseInt(id);
  
//       if (isNaN(userId)) {
//         return NextResponse.json({ error: 'Invalid user ID.' }, { status: 400 });
//       }
  
//       const body = await req.json();
//       const { name, email, password, role } = body;
  
//       if (!name || !email) {
//         return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
//       }
  
//       const existingUser = await prisma.user.findUnique({
//         where: { email },
//       });
  
//       if (existingUser && existingUser.id !== userId) {
//         return NextResponse.json({ error: 'Email already in use.' }, { status: 400 });
//       }
  
//       const updatedUser = await prisma.user.update({
//         where: { id: userId },
//         data: {
//           name,
//           email,
//           password: password ? password : undefined,  // Only update password if provided
//           role: role || 'user',  // Default to 'user' if no role is provided
//         },
//       });
  
//       return NextResponse.json(updatedUser, { status: 200 });
  
//     } catch (error) {
//       return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
//     }
//   }
  