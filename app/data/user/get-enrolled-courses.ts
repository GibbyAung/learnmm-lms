"use server";

import { prisma } from "@/lib/prisma";
import { requiredUser } from "./require-user";

export async function getEnrolledCourses() {
  const user = await requiredUser();

  const data = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      status: "Active",
    },
    select: {
      course: {
        select: {
          id: true,
          smallDescription: true,
          title: true,
          fileKey: true,
          slug: true,
          duration: true,
          courseChapters: {
            select: {
              id: true,
              lessons: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return data;
}
