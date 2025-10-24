import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bungalov Rezervasyon",
  description: "Bungalovlar için online rezervasyon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="mx-auto max-w-6xl p-4">
          <header className="py-6 border-b mb-6">
            <h1 className="text-2xl font-semibold">Bungalov Rezervasyon</h1>
          </header>
          {children}
          <footer className="mt-12 border-t py-6 text-sm text-gray-500">
            © {new Date().getFullYear()} Bungalov. Tüm hakları saklıdır.
          </footer>
        </div>
      </body>
    </html>
  );
}
