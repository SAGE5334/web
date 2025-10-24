import Link from "next/link";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export default async function Home() {
  const bungalows = await prisma.bungalow.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Bungalovlar</h2>
        <Link className="text-blue-600" href="/admin">Admin</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bungalows.map((b) => (
          <Link
            key={b.id}
            href={`/bungalows/${b.slug}`}
            className="border rounded-lg p-4 hover:shadow"
          >
            <div className="aspect-video bg-gray-100 rounded mb-3"></div>
            <div className="font-medium">{b.title}</div>
            <div className="text-sm text-gray-500">{b.location}</div>
            <div className="mt-2 text-sm">
              {b.capacity} kişi · {(b.pricePerNightCents / 100).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}/gece
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
