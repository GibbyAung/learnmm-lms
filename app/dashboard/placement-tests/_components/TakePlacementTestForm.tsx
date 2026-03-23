"use client";

import { submitPlacementTest } from "@/app/data/placement/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useConstruct } from "@/hooks/use-construct";

export function TakePlacementTestForm({
  resultId,
  questions,
}: {
  resultId: string;
  questions: {
    id: string;
    question: string;
    imageUrl?: string | null;
    type: "MULTIPLE_CHOICE" | "TRUE_FALSE";
    options: unknown;
  }[];
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async () => {
    setLoading(true);
    const response = await submitPlacementTest({
      resultId,
      answers: questions.map((question) => ({
        questionId: question.id,
        answer: answers[question.id] ?? "",
      })),
    });
    setLoading(false);

    if (response.status === "error") {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {questions.map((question, index) => {
        const options =
          question.type === "TRUE_FALSE"
            ? ["true", "false"]
            : Array.isArray(question.options)
              ? (question.options as string[])
              : [];

        return (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle>
                {index + 1}. {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Debug: log imageUrl */}
              {question.imageUrl ? (
                <div className="mb-4">
                  <img
                    src={useConstruct(question.imageUrl)}
                    alt="Question image"
                    className="max-w-full h-auto rounded-md border"
                  />
                </div>
              ) : null}
              <div className="space-y-2">
                {options.map((option) => (
                  <label className="flex items-center gap-2" key={option}>
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={answers[question.id] === option}
                      onChange={(event) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [question.id]: event.target.value,
                        }))
                      }
                    />
                    <Label>{option}</Label>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Button type="button" onClick={submit} disabled={loading}>
        {loading ? "Submitting..." : "Submit test"}
      </Button>
    </div>
  );
}
