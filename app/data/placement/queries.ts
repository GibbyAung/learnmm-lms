import { requireAdmin } from "@/app/data/admin/require-admin";
import { requiredUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/prisma";

type PlacementQueryDb = {
  placementTest: {
    findMany: (args: object) => Promise<unknown>;
    findFirst: (args: object) => Promise<unknown>;
  };
  placementResult: {
    findMany: (args: object) => Promise<unknown>;
    findFirst: (args: object) => Promise<unknown>;
  };
  user: { findMany: (args: object) => Promise<unknown> };
};

const db = prisma as unknown as PlacementQueryDb;

export async function adminGetPlacementTests() {
  const session = await requireAdmin();

  return (await db.placementTest.findMany({
    where: { teacherId: session.user.id },
    include: { _count: { select: { questions: true, results: true } } },
    orderBy: { createdAt: "desc" },
  })) as Array<{
    id: string;
    title: string;
    description: string | null;
    _count: { questions: number; results: number };
  }>;
}

export async function adminGetPlacementTest(testId: string) {
  const session = await requireAdmin();

  const result = await db.placementTest.findFirst({
    where: { id: testId, teacherId: session.user.id },
    include: { questions: { orderBy: { position: "asc" } } },
  });

  console.log(
    "adminGetPlacementTest - Raw result:",
    JSON.stringify(result, null, 2),
  );

  return result as {
    id: string;
    title: string;
    description: string | null;
    questions: Array<{
      id: string;
      question: string;
      imageUrl: string | null;
      type: "MULTIPLE_CHOICE" | "TRUE_FALSE";
      options: unknown;
      correctAnswer: string;
    }>;
  } | null;
}

export async function adminGetPlacementResults() {
  const session = await requireAdmin();

  return (await db.placementResult.findMany({
    where: { assignedById: session.user.id },
    include: {
      student: { select: { id: true, name: true, email: true } },
      test: { select: { id: true, title: true } },
    },
    orderBy: { updatedAt: "desc" },
  })) as Array<{
    id: string;
    status: string;
    score: number | null;
    correctCount: number;
    totalQuestions: number;
    student: { id: string; name: string; email: string };
    test: { id: string; title: string };
  }>;
}

export async function adminGetStudents() {
  await requireAdmin();

  return (await db.user.findMany({
    where: { role: { not: "admin" } },
    select: { id: true, name: true, email: true },
    orderBy: { createdAt: "desc" },
  })) as Array<{ id: string; name: string; email: string }>;
}

export async function studentGetAssignedPlacementTests() {
  const user = await requiredUser();

  return (await db.placementResult.findMany({
    where: { studentId: user.id },
    include: { test: { select: { id: true, title: true, description: true } } },
    orderBy: { assignedAt: "desc" },
  })) as Array<{
    id: string;
    status: string;
    score: number | null;
    test: { id: string; title: string; description: string | null };
  }>;
}

export async function studentGetPlacementResult(resultId: string) {
  const user = await requiredUser();

  const result = await db.placementResult.findFirst({
    where: { id: resultId, studentId: user.id },
    include: {
      test: { include: { questions: { orderBy: { position: "asc" } } } },
      answers: true,
    },
  });

  console.log(
    "studentGetPlacementResult - Raw result:",
    JSON.stringify(result, null, 2),
  );

  return result as {
    id: string;
    status: string;
    score: number | null;
    correctCount: number;
    totalQuestions: number;
    test: {
      title: string;
      questions: Array<{
        id: string;
        question: string;
        imageUrl: string | null;
        type: "MULTIPLE_CHOICE" | "TRUE_FALSE";
        options: unknown;
        correctAnswer: string;
      }>;
    };
    answers: Array<{ questionId: string; answer: string; isCorrect: boolean }>;
  } | null;
}
