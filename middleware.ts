import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// 1. Convert your secret string into a Uint8Array (required by jose)
const JWT_SECRET = new TextEncoder().encode("Sumit8076");

export async function middleware(req: NextRequest) {
  let token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { msg: "Token not provided" }, 
      { status: 401 }
    );
  }
  try {
    await jwtVerify(token, JWT_SECRET);
    
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { msg: "Invalid or expired token" }, 
      { status: 401 }
    );
  }
}

// 8. Protect all endpoints starting with /api/post/
export const config = {
  matcher: ["/api/post/:path*"],
};