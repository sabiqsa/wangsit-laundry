import { NextRequest, NextResponse } from "next/server";

// In-memory rate limiter fallback (per-process, not distributed)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  req: NextRequest,
  limit = 5,
  windowMs = 60 * 1000
): NextResponse | null {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "anonymous";

  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return null;
  }

  entry.count += 1;
  if (entry.count > limit) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan. Coba lagi nanti." },
      { status: 429 }
    );
  }

  return null;
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) rateLimitMap.delete(key);
  }
}, 5 * 60 * 1000);
