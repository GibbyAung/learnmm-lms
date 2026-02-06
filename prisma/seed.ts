import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "seed@demo.local" },
    update: {},
    create: {
      id: crypto.randomUUID(),
      name: "Seed User",
      email: "seed@demo.local",
      emailVerified: true,
      role: "ADMIN",
      banned: false,
    },
  });

  await prisma.course.create({
    data: {
      title: "IT Fundamentals for Developers",
      description: "Networking, Linux basics, and practical troubleshooting.",
      smallDescription: "Core IT skills for software engineers.",
      category: "IT and Software",
      slug: "it-fundamentals-for-developers",
      price: 25000,
      duration: 180,
      level: "BEGINNER",
      status: "PUBLISHED",
      fileKey: "seed/it-fundamentals",
      userId: user.id,
      courseChapters: {
        create: [
          {
            title: "Linux & CLI Basics",
            position: 1,
            description: "Files, permissions, processes, and debugging.",
            duration: 60,
            lessons: {
              create: [
                { title: "File system + permissions", position: 1 },
                { title: "Processes and ports", position: 2 },
              ],
            },
          },
          {
            title: "Networking Basics",
            position: 2,
            description: "DNS, HTTP, TCP/UDP, proxies and load balancers.",
            duration: 60,
            lessons: {
              create: [
                { title: "DNS basics", position: 1 },
                { title: "HTTP vs HTTPS", position: 2 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Seed completed.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
