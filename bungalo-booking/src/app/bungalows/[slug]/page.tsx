import { PrismaClient } from "@/generated/prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BungalowPage({ params }: PageProps) {
  const { slug } = await params;
  const bungalow = await prisma.bungalow.findUnique({ where: { slug } });
  if (!bungalow) return notFound();

  return (
    <main>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-video bg-gray-100 rounded" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold mb-2">{bungalow.title}</h1>
          <div className="text-gray-600 mb-4">{bungalow.location}</div>
          <p className="mb-4 whitespace-pre-line">{bungalow.description}</p>
          <div className="mb-4">
            Kapasite: {bungalow.capacity} kişi
          </div>
          <div className="text-lg font-medium mb-6">
            {(bungalow.pricePerNightCents / 100).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}/gece
          </div>
          <form action="/api/bookings" method="POST" className="space-y-3 border rounded p-4">
            <input type="hidden" name="bungalowId" value={bungalow.id} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input name="customerName" placeholder="Ad Soyad" className="border rounded p-2" required />
              <input name="customerEmail" type="email" placeholder="E-posta" className="border rounded p-2" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input name="customerPhone" placeholder="Telefon" className="border rounded p-2" />
              <input name="guests" type="number" min={1} max={bungalow.capacity} placeholder="Kişi sayısı" className="border rounded p-2" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input name="checkIn" type="date" className="border rounded p-2" required />
              <input name="checkOut" type="date" className="border rounded p-2" required />
            </div>
            <button className="bg-black text-white rounded px-4 py-2" type="submit">Rezervasyon Yap</button>
          </form>
        </div>
      </div>
    </main>
  );
}
