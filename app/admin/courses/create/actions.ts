"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApiReponse } from "@/lib/types";
import { CourseScehmaType, courseSchema } from "@/lib/zodSchemas";
import { headers } from "next/headers";

export async function CreateCourse(
  value: CourseScehmaType
): Promise<ApiReponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const validation = courseSchema.safeParse(value);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }

    const transformedData = {
      ...validation.data,
      level: validation.data.level.toUpperCase() as
        | "BEGINNER"
        | "INTERMEDIATE"
        | "ADVANCED",
      status: validation.data.status.toUpperCase() as
        | "PUBLISHED"
        | "DRAFT"
        | "ARCHIVED",
      userId: session?.user.id as string,
    };

    await prisma.course.create({
      data: transformedData,
    });

    return {
      status: "success",
      message: "Created Course Successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create a course.",
    };
  }
}
