import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { registerSchema } from "@/schemas/auth.schema";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 5, 60 * 1000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = parsed.data;

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await User.create({ name, email, passwordHash, phone, role: "client" });

    return NextResponse.json(
      { success: true, message: "Registrasi berhasil" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
