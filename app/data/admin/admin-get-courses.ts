import { truncateByDomain } from "recharts/types/util/ChartUtils";
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/prisma";

export async function adminGetCourses() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await requireAdmin();

  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      fileKey: true,
      smallDescription: true,
      duration: true,
      slug: true,
      price: true,
      status: true,
      level: true,
    },
  });

  return data;
}

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0];
