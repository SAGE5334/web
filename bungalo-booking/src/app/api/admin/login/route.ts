import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@/generated/prisma/client";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/auth";

const prisma = new PrismaClient();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz giriş" }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 401 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok || user.role !== "ADMIN") {
    return NextResponse.json({ error: "E-posta veya şifre hatalı" }, { status: 401 });
  }

  const token = signToken({ userId: user.id, role: user.role });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}
