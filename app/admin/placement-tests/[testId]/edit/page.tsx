import { adminGetPlacementTest } from "@/app/data/placement/queries";
import { PlacementTestEditor } from "../../_components/PlacementTestEditor";
import { updatePlacementTest } from "@/app/data/placement/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";

export default async function EditPlacementTestPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  const test = (await adminGetPlacementTest(testId)) as {
    title: string;
    description: string | null;
    questions: Array<{
      question: string;
      imageUrl: string | null;
      type: "MULTIPLE_CHOICE" | "TRUE_FALSE";
      options: unknown;
      correctAnswer: string;
    }>;
  } | null;

  if (!test) {
    notFound();
  }

  return (
    <div className="relative space-y-6">
      <Link
        href="/admin/placement-tests"
        className={buttonVariants({
          variant: "outline",
          className: "relative",
        })}
      >
        <ArrowLeft />
        <Label>Back</Label>
      </Link>
      <h1 className="text-2xl font-bold">Edit placement test</h1>
      <PlacementTestEditor
        initialValue={{
          title: test.title,
          description: test.description ?? "",
          questions: test.questions.map((question) => ({
            question: question.question,
            imageUrl: question.imageUrl ?? undefined,
            type: question.type,
            options: Array.isArray(question.options)
              ? (question.options as string[])
              : question.type === "TRUE_FALSE"
                ? ["true", "false"]
                : [],
            correctAnswer: question.correctAnswer,
          })),
        }}
        mode="edit"
        testId={testId}
      />
    </div>
  );
}
