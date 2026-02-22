import { prisma } from "@/lib/prisma";

export async function getAllCourses() {
  const data = await prisma.course.findMany({
    where: {
      status: "PUBLISHED",
    },
    select: {
      title: true,
      category: true,
      price: true,
      smallDescription: true,
      slug: true,
      fileKey: true,
      id: true,
      level: true,
      duration: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0];
