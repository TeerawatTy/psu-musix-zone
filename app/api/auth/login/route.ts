// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import isValidPassword from "@/utils/isValidPassword";
import { loginUser } from "@/utils/loginUser";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await isValidPassword(password, user.password))) {
      throw new Error("Invalid email or password");
    }

    await loginUser(user, true); // Setting "remember" to true for now

    return NextResponse.json({ message: "Login successful!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
