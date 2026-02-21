"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcject, { fixedWindow } from "@/lib/arcject";
import { prisma } from "@/lib/prisma";
import { ApiReponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcject.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  }),
);

export async function deleteCourse(courseId: string): Promise<ApiReponse> {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session?.user.id,
    });

    if (!decision.isAllowed) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Too many requests. Please try again later.",
        };
      }
      return {
        status: "error",
        message:
          "You look like a bot, if it's a mistake please contact support",
      };
    }

    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    revalidatePath(`/admin/courses`);

    return {
      status: "success",
      message: "Course Deleted Successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to delete course",
    };
  }
}
