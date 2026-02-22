import { adminGetPlacementTest } from "@/app/data/placement/queries";
import { PlacementTestEditor } from "../../_components/PlacementTestEditor";
import { updatePlacementTest } from "@/app/data/placement/actions";
import { notFound } from "next/navigation";

export default async function EditPlacementTestPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  const test = (await adminGetPlacementTest(testId)) as
    | {
        title: string;
        description: string | null;
        questions: Array<{
          question: string;
          type: "MULTIPLE_CHOICE" | "TRUE_FALSE";
          options: unknown;
          correctAnswer: string;
        }>;
      }
    | null;

  if (!test) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit placement test</h1>
      <PlacementTestEditor
        initialValue={{
          title: test.title,
          description: test.description ?? "",
          questions: test.questions.map((question) => ({
            question: question.question,
            type: question.type,
            options: Array.isArray(question.options)
              ? (question.options as string[])
              : question.type === "TRUE_FALSE"
                ? ["true", "false"]
                : [],
            correctAnswer: question.correctAnswer,
          })),
        }}
        onSubmit={(value) => updatePlacementTest(testId, value)}
      />
    </div>
  );
}
