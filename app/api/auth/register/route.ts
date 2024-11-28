import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  let body: any;

  try {
    // Raw body text received
    const rawBody = await req.text();
    console.log('Raw body received:', rawBody);

    // Try to parse the body manually
    body = rawBody ? JSON.parse(rawBody) : null;

    // If the body is null or not an object, return an error
    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Invalid request body or missing fields' }),
        { status: 400 }
      );
    }

    // Extract values from the body
    const { email, password, name } = body;

    // Validate the fields
    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({ error: 'Email, password, and name are required' }),
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'User already exists' }),
        { status: 400 }
      );
    }

    // Create the new user
    const newUser = await prisma.user.create({
      data: { email, password, name },
    });

    // Return a success message
    return new Response(
      JSON.stringify({ message: 'User created successfully', user: newUser }),
      { status: 201 }
    );

  } catch (error) {
    console.error('Error during user creation:', error);

    // Return a generic server error message
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
