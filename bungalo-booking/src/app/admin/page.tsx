import { PrismaClient } from "@/generated/prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const [bookings, bungalows] = await Promise.all([
    prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 20, include: { bungalow: true } }),
    prisma.bungalow.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <main>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Yönetim Paneli</h1>
        <Link className="text-blue-600" href="/">Siteye Dön</Link>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Son Rezervasyonlar</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Tarih</th>
                <th className="p-2 text-left">Bungalov</th>
                <th className="p-2 text-left">Müşteri</th>
                <th className="p-2 text-left">Durum</th>
                <th className="p-2 text-left">Tutar</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{new Date(r.createdAt).toLocaleString("tr-TR")}</td>
                  <td className="p-2">{r.bungalow.title}</td>
                  <td className="p-2">{r.customerName}</td>
                  <td className="p-2">{r.status}</td>
                  <td className="p-2">{(r.totalPriceCents / 100).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Bungalovlar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bungalows.map((b) => (
            <div key={b.id} className="border rounded p-4">
              <div className="font-medium mb-1">{b.title}</div>
              <div className="text-sm text-gray-500 mb-2">{b.location}</div>
              <div className="text-sm">Kapasite: {b.capacity} · Fiyat: {(b.pricePerNightCents/100).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}/gece</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
