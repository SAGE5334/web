import "dotenv/config";
import { PrismaClient, Role } from "../generated/prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@example.com";
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      name: "Admin",
      passwordHash,
      role: Role.ADMIN,
    },
    update: {},
  });

  const bungalows = [
    {
      slug: "gokova-suites-1",
      title: "Gökova Bungalov 1",
      description: "Orman ve deniz manzaralı modern bungalov.",
      pricePerNightCents: 25000,
      capacity: 2,
      location: "Akyaka, Muğla",
      imageUrl: "/bungalows/1.jpg",
    },
    {
      slug: "gokova-suites-2",
      title: "Gökova Bungalov 2",
      description: "Jakuzili, şömineli romantik kaçamak.",
      pricePerNightCents: 35000,
      capacity: 3,
      location: "Akyaka, Muğla",
      imageUrl: "/bungalows/2.jpg",
    },
    {
      slug: "sapanca-lake-view",
      title: "Sapanca Göl Manzaralı",
      description: "Göl kenarında geniş teraslı bungalov.",
      pricePerNightCents: 40000,
      capacity: 4,
      location: "Sapanca, Sakarya",
      imageUrl: "/bungalows/3.jpg",
    },
  ];

  for (const b of bungalows) {
    await prisma.bungalow.upsert({
      where: { slug: b.slug },
      create: b,
      update: {
        title: b.title,
        description: b.description,
        pricePerNightCents: b.pricePerNightCents,
        capacity: b.capacity,
        location: b.location,
        imageUrl: b.imageUrl,
      },
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
