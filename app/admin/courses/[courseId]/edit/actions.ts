"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcject, { detectBot, fixedWindow } from "@/lib/arcject";
import { prisma } from "@/lib/prisma";
import { ApiReponse } from "@/lib/types";
import { CourseScehmaType, courseSchema } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";

const aj = arcject
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );

export async function editCourse(
  data: CourseScehmaType,
  courseId: string
): Promise<ApiReponse> {
  const user = await requireAdmin();

  try {
    const req = await request();

    const decision = await aj.protect(req, {
      fingerprint: user?.user.id,
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

    const result = courseSchema.safeParse(data);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    const transformedData = {
      ...result.data,
      level: data.level.toUpperCase() as
        | "BEGINNER"
        | "INTERMEDIATE"
        | "ADVANCED",
      status: data.status.toUpperCase() as "PUBLISHED" | "DRAFT" | "ARCHIVED",
      userId: user.user.id,
    };

    const course = await prisma.course.findFirst({
      where: { id: courseId, userId: user.user.id },
      select: { id: true },
    });

    if (!course) {
      return { status: "error", message: "Course not found or not yours." };
    }

    await prisma.course.update({
      where: {
        id: courseId,
        userId: user.user.id,
      },
      data: {
        ...transformedData,
      },
    });

    return {
      status: "success",
      message: "Updated Course Successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update course data.",
    };
  }
}
