import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/loginUser";

export async function middleware(request: NextRequest) {
  const res = await updateSession(request);
  return res || NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
