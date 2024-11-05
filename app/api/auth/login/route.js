// auth/login/route.js
import { NextResponse } from 'next/server';
import { signIn } from 'next-auth/react';

export async function POST(request) {
    const { email, password } = await request.json();

    const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
    });

    if (result?.error) {
        return NextResponse.json({ error: result.error }, { status: 401 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
}
