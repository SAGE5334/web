import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

const QuerySchema = z.object({
  bungalowId: z.coerce.number().int().positive(),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    bungalowId: searchParams.get("bungalowId"),
    checkIn: searchParams.get("checkIn"),
    checkOut: searchParams.get("checkOut"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { bungalowId, checkIn, checkOut } = parsed.data;
  if (checkOut <= checkIn) {
    return NextResponse.json({ error: "Çıkış tarihi girişten sonra olmalı" }, { status: 400 });
  }

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

  return NextResponse.json({ available: !overlap });
}
