"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { ApiReponse } from "@/lib/types";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";

export async function updateLesson(
  value: LessonSchemaType,
  lessonId: string
): Promise<ApiReponse> {
  await requireAdmin();

  try {
    const result = lessonSchema.safeParse(value);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid Data",
      };
    }

    const responseData = result.data;

    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        title: responseData.name,
        description: responseData.description,
        thumbnailKey: responseData.thumbnailKey,
        videoKey: responseData.videoKey,
      },
    });

    return {
      status: "success",
      message: "Lesson Updated Successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to Update Lesson",
    };
  }
}
