"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { requiredUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/prisma";
import { ApiReponse } from "@/lib/types";
import {
  assignPlacementTestSchema,
  AssignPlacementTestSchemaType,
  placementTestSchema,
  PlacementTestSchemaType,
  submitPlacementTestSchema,
  SubmitPlacementTestSchemaType,
} from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";

type PlacementDb = {
  placementTest: {
    create: (args: object) => Promise<unknown>;
    findFirst: (args: object) => Promise<unknown>;
    update: (args: object) => Promise<unknown>;
  };
  placementQuestion: {
    deleteMany: (args: object) => Promise<unknown>;
  };
  placementResult: {
    upsert: (args: object) => Promise<unknown>;
    findFirst: (args: object) => Promise<unknown>;
    update: (args: object) => Promise<unknown>;
  };
  placementAnswer: {
    deleteMany: (args: object) => Promise<unknown>;
    createMany: (args: object) => Promise<unknown>;
  };
  $transaction: <T>(callback: (tx: PlacementDb) => Promise<T>) => Promise<T>;
};

const db = prisma as unknown as PlacementDb;

export async function createPlacementTest(
  values: PlacementTestSchemaType,
): Promise<ApiReponse> {
  const session = await requireAdmin();
  const parsed = placementTestSchema.safeParse(values);

  if (!parsed.success) {
    return { status: "error", message: "Invalid test payload" };
  }

  try {
    await db.placementTest.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        teacherId: session.user.id,
        questions: {
          create: parsed.data.questions.map((question, index) => ({
            question: question.question,
            type: question.type,
            options: question.options,
            correctAnswer: question.correctAnswer,
            position: index + 1,
          })),
        },
      },
    });

    revalidatePath("/admin/placement-tests");
    return { status: "success", message: "Placement test created" };
  } catch {
    return { status: "error", message: "Failed to create placement test" };
  }
}

export async function updatePlacementTest(
  testId: string,
  values: PlacementTestSchemaType,
): Promise<ApiReponse> {
  const session = await requireAdmin();
  const parsed = placementTestSchema.safeParse(values);

  if (!parsed.success) {
    return { status: "error", message: "Invalid test payload" };
  }

  try {
    const existing = (await db.placementTest.findFirst({
      where: { id: testId, teacherId: session.user.id },
      select: { id: true },
    })) as { id: string } | null;

    if (!existing) {
      return { status: "error", message: "Test not found" };
    }

    await db.$transaction(async (tx) => {
      await tx.placementQuestion.deleteMany({ where: { testId } });

      await tx.placementTest.update({
        where: { id: testId },
        data: {
          title: parsed.data.title,
          description: parsed.data.description,
          questions: {
            create: parsed.data.questions.map((question, index) => ({
              question: question.question,
              type: question.type,
              options: question.options,
              correctAnswer: question.correctAnswer,
              position: index + 1,
            })),
          },
        },
      });
    });

    revalidatePath("/admin/placement-tests");
    revalidatePath(`/admin/placement-tests/${testId}/edit`);
    return { status: "success", message: "Placement test updated" };
  } catch {
    return { status: "error", message: "Failed to update placement test" };
  }
}

export async function assignPlacementTest(
  values: AssignPlacementTestSchemaType,
): Promise<ApiReponse> {
  const session = await requireAdmin();
  const parsed = assignPlacementTestSchema.safeParse(values);

  if (!parsed.success) {
    return { status: "error", message: "Invalid assignment payload" };
  }

  try {
    const test = (await db.placementTest.findFirst({
      where: { id: parsed.data.testId, teacherId: session.user.id },
      include: { questions: { select: { id: true } } },
    })) as { questions: Array<{ id: string }> } | null;

    if (!test) {
      return { status: "error", message: "Placement test not found" };
    }

    await db.placementResult.upsert({
      where: {
        testId_studentId: {
          testId: parsed.data.testId,
          studentId: parsed.data.studentId,
        },
      },
      update: {
        assignedById: session.user.id,
        assignedAt: new Date(),
        status: "ASSIGNED",
        submittedAt: null,
        score: null,
        correctCount: 0,
        totalQuestions: test.questions.length,
        answers: {
          deleteMany: {},
        },
      },
      create: {
        testId: parsed.data.testId,
        studentId: parsed.data.studentId,
        assignedById: session.user.id,
        totalQuestions: test.questions.length,
      },
    });

    revalidatePath("/admin/placement-tests/assign");
    return { status: "success", message: "Placement test assigned" };
  } catch {
    return { status: "error", message: "Failed to assign placement test" };
  }
}

export async function submitPlacementTest(
  values: SubmitPlacementTestSchemaType,
): Promise<ApiReponse> {
  const user = await requiredUser();
  const parsed = submitPlacementTestSchema.safeParse(values);

  if (!parsed.success) {
    return { status: "error", message: "Invalid submission payload" };
  }

  try {
    const result = (await db.placementResult.findFirst({
      where: {
        id: parsed.data.resultId,
        studentId: user.id,
      },
      include: {
        test: {
          include: {
            questions: {
              orderBy: { position: "asc" },
            },
          },
        },
      },
    })) as {
      id: string;
      status: string;
      test: { questions: Array<{ id: string; correctAnswer: string }> };
    } | null;

    if (!result) {
      return { status: "error", message: "Assigned test not found" };
    }

    if (result.status !== "ASSIGNED") {
      return { status: "error", message: "Test already submitted" };
    }

    const submittedByQuestion = new Map(
      parsed.data.answers.map((answer) => [answer.questionId, answer.answer]),
    );

    const gradedAnswers = result.test.questions.map((question) => {
      const answer = submittedByQuestion.get(question.id) ?? "";
      const isCorrect = answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();

      return {
        questionId: question.id,
        answer,
        isCorrect,
      };
    });

    const correctCount = gradedAnswers.filter((answer) => answer.isCorrect).length;
    const totalQuestions = result.test.questions.length;
    const score = totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100);

    await db.$transaction(async (tx) => {
      await tx.placementAnswer.deleteMany({ where: { resultId: result.id } });
      await tx.placementAnswer.createMany({
        data: gradedAnswers.map((answer) => ({
          ...answer,
          resultId: result.id,
        })),
      });

      await tx.placementResult.update({
        where: { id: result.id },
        data: {
          status: "GRADED",
          submittedAt: new Date(),
          correctCount,
          totalQuestions,
          score,
        },
      });
    });

    revalidatePath("/dashboard/placement-tests");
    revalidatePath(`/dashboard/placement-tests/${result.id}`);
    revalidatePath("/admin/placement-tests/results");

    return { status: "success", message: "Placement test submitted" };
  } catch {
    return { status: "error", message: "Failed to submit placement test" };
  }
}
