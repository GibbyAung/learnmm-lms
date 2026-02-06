import { prisma } from "@/lib/prisma";
import "server-only";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";

export async function adminGetCourse(courseId: string) {
  await requireAdmin();

  const data = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
      description: true,
      title: true,
      fileKey: true,
      smallDescription: true,
      category: true,
      duration: true,
      slug: true,
      price: true,
      status: true,
      level: true,
      courseChapters: {
        select: {
          id: true,
          title: true,
          description: true,
          duration: true,
          position: true,
          lessons: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbnailKey: true,
              videoKey: true,
              position: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export type AdminIndividualCourseType = Awaited<
  ReturnType<typeof adminGetCourse>
>;
