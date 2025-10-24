import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

const BookingSchema = z.object({
  bungalowId: z.coerce.number().int().positive(),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional().nullable(),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  guests: z.coerce.number().int().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const form = contentType.includes("application/json")
      ? await req.json()
      : Object.fromEntries((await req.formData()).entries());

    const parsed = BookingSchema.safeParse(form);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { bungalowId, customerName, customerEmail, customerPhone, checkIn, checkOut, guests } = parsed.data;

    if (checkOut <= checkIn) {
      return NextResponse.json({ error: "Çıkış tarihi girişten sonra olmalı" }, { status: 400 });
    }

    const bungalow = await prisma.bungalow.findUnique({ where: { id: bungalowId } });
    if (!bungalow) return NextResponse.json({ error: "Bungalov bulunamadı" }, { status: 404 });
    if (guests > bungalow.capacity) return NextResponse.json({ error: "Kapasite aşılamaz" }, { status: 400 });

    const overlap = await prisma.booking.findFirst({
      where: {
        bungalowId,
        status: { in: ["PENDING", "CONFIRMED"] },
        NOT: [
          { checkOut: { <=: checkIn } },
          { checkIn: { >=: checkOut } },
        ],
      },
    });

    if (overlap) {
      return NextResponse.json({ error: "Seçili tarihler dolu" }, { status: 409 });
    }

    const nights = Math.ceil((+checkOut - +checkIn) / (1000 * 60 * 60 * 24));
    const totalPriceCents = nights * bungalow.pricePerNightCents;

    const booking = await prisma.booking.create({
      data: {
        bungalowId,
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        checkIn,
        checkOut,
        guests,
        totalPriceCents,
        status: "PENDING",
      },
    });

    return NextResponse.json({ ok: true, bookingId: booking.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
