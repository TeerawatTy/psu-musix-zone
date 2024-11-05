// auth/logout/route.js
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import authOptions from '../[...nextauth]/route'; // Import your NextAuth options

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    // Logout logic can be managed by the client with next-auth
    return NextResponse.json({ success: true }, { status: 200 });
}
