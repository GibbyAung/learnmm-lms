"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcject, {  fixedWindow } from "@/lib/arcject";
import { prisma } from "@/lib/prisma";
import { ApiReponse } from "@/lib/types";
import {
  chapterSchema,
  ChapterSchemaType,
  CourseScehmaType,
  courseSchema,
  lessonSchema,
  LessonSchemaType,
} from "@/lib/zodSchemas";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcject
  .withRule(

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

export async function reorderLessonsAction(
  chapterId: string,
  lessons: {
    id: string;
    position: number;
  }[],
  courseId: string
): Promise<ApiReponse> {
  try {
    if (!lessons || lessons.length === 0) {
      return {
        status: "error",
        message: "No lessons to reorder.",
      };
    }

    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: { id: lesson.id, courseChapterId: chapterId },
        data: { position: lesson.position },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Reordered lessons successfully.",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Failed to reorder lessons.",
    };
  }
}

export async function reorderChaptersAction(
  chapters: {
    id: string;
    position: number;
  }[],
  courseId: string
): Promise<ApiReponse> {
  try {
    if (!chapters || chapters.length === 0) {
      return {
        status: "error",
        message: "No chapters to reorder.",
      };
    }

    const updates = chapters.map((chapter) =>
      prisma.courseChapter.update({
        where: { id: chapter.id, courseId: courseId },
        data: { position: chapter.position },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Reordered chapters successfully.",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Failed to reorder chapters.",
    };
  }
}

export async function createChapter(
  values: ChapterSchemaType
): Promise<ApiReponse> {
  await requireAdmin();
  try {
    const result = chapterSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.courseChapter.findFirst({
        where: { courseId: result.data.courseId },
        orderBy: { position: "desc" },
        select: { position: true },
      });

      await tx.courseChapter.create({
        data: {
          title: result.data.name,
          courseId: result.data.courseId,
          position: maxPos ? maxPos?.position + 1 : 1,
          description: "",
          duration: 0,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Chapter created successfully.",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Failed to create chapter.",
    };
  }
}

export async function createLesson(
  values: LessonSchemaType
): Promise<ApiReponse> {
  await requireAdmin();
  try {
    const result = lessonSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.lesson.findFirst({
        where: { courseChapterId: result.data.chapterId },
        orderBy: { position: "desc" },
        select: { position: true },
      });

      await tx.lesson.create({
        data: {
          title: result.data.name,
          courseChapterId: result.data.chapterId,
          position: maxPos ? maxPos?.position + 1 : 1,
          description: result.data.descrpition,
          videoKey: result.data.videoKey,
          thumbnailKey: result.data.thumbnailKey,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Lesson created successfully.",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Failed to create lesson.",
    };
  }
}

export async function deleteLesson({
  chapterId,
  courseId,
  lessonId,
}: {
  chapterId: string;
  courseId: string;
  lessonId: string;
}): Promise<ApiReponse> {
  try {
    await requireAdmin();

    const chapterWithLessons = await prisma.courseChapter.findUnique({
      where: {
        id: chapterId,
      },
      select: {
        lessons: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!chapterWithLessons) {
      return {
        status: "error",
        message: "Chapter not Found",
      };
    }

    const lessons = chapterWithLessons.lessons;

    const lessonstoDelete = lessons.find((lesson) => lesson.id === lessonId);

    if (!lessonstoDelete) {
      return {
        status: "error",
        message: "Lessons not found to delete",
      };
    }

    const remainingLessons = lessons.filter((lesson) => lesson.id !== lessonId);

    const updates = remainingLessons.map((lesson, index) => {
      return prisma.lesson.update({
        where: { id: lesson.id },
        data: { position: index + 1 },
      });
    });

    await prisma.$transaction([
      ...updates,
      prisma.lesson.delete({
        where: { id: lessonId, courseChapterId: chapterId },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lesson deleted successfully.",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to delete lesson.",
    };
  }
}

export async function deleteChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}): Promise<ApiReponse> {
  try {
    await requireAdmin();

    const courseWithChapters = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        courseChapters: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!courseWithChapters) {
      return {
        status: "error",
        message: "Chapter not Found",
      };
    }

    const chapters = courseWithChapters.courseChapters;

    const chapterstoDelete = chapters.find((chap) => chap.id === chapterId);

    if (!chapterstoDelete) {
      return {
        status: "error",
        message: "Chapter not found to delete",
      };
    }

    const remainingChapters = chapters.filter(
      (chapter) => chapter.id !== chapterId
    );

    const updates = remainingChapters.map((chapter, index) => {
      return prisma.courseChapter.update({
        where: { id: chapter.id },
        data: { position: index + 1 },
      });
    });

    await prisma.$transaction([
      ...updates,
      prisma.courseChapter.delete({
        where: { id: chapterId },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapter deleted successfully.",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to delete chapter.",
    };
  }
}
