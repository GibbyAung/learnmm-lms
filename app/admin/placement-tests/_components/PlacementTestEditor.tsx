"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { placementQuestionSchema, PlacementTestSchemaType } from "@/lib/zodSchemas";
import { toast } from "sonner";

export function PlacementTestEditor({
  initialValue,
  onSubmit,
}: {
  initialValue?: PlacementTestSchemaType;
  onSubmit: (value: PlacementTestSchemaType) => Promise<{ status: "success" | "error"; message: string }>;
}) {
  const [title, setTitle] = useState(initialValue?.title ?? "");
  const [description, setDescription] = useState(initialValue?.description ?? "");
  const [questions, setQuestions] = useState<PlacementTestSchemaType["questions"]>(
    initialValue?.questions ?? [
      {
        question: "",
        type: "MULTIPLE_CHOICE",
        options: ["", ""],
        correctAnswer: "",
      },
    ],
  );
  const [loading, setLoading] = useState(false);

  const updateQuestion = (
    index: number,
    field: keyof PlacementTestSchemaType["questions"][number],
    value: string | string[],
  ) => {
    setQuestions((prev) =>
      prev.map((question, idx) =>
        idx === index ? { ...question, [field]: value } : question,
      ),
    );
  };

  const submit = async () => {
    const sanitizedQuestions = questions.map((question) => ({
      ...question,
      options:
        question.type === "MULTIPLE_CHOICE"
          ? question.options.filter((option) => option.trim().length > 0)
          : ["true", "false"],
    }));

    for (const question of sanitizedQuestions) {
      const result = placementQuestionSchema.safeParse(question);
      if (!result.success) {
        toast.error(result.error.issues[0]?.message ?? "Invalid question");
        return;
      }
    }

    setLoading(true);
    const response = await onSubmit({
      title,
      description,
      questions: sanitizedQuestions,
    });
    setLoading(false);

    if (response.status === "error") {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(event) => setDescription(event.target.value)} />
          </div>
        </CardContent>
      </Card>

      {questions.map((question, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>Question {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Question text"
              value={question.question}
              onChange={(event) => updateQuestion(index, "question", event.target.value)}
            />
            <select
              className="w-full rounded-md border p-2"
              value={question.type}
              onChange={(event) =>
                updateQuestion(index, "type", event.target.value as "MULTIPLE_CHOICE" | "TRUE_FALSE")
              }
            >
              <option value="MULTIPLE_CHOICE">Multiple choice</option>
              <option value="TRUE_FALSE">True / False</option>
            </select>

            {question.type === "MULTIPLE_CHOICE" && (
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <Input
                    key={optionIndex}
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(event) => {
                      const next = [...question.options];
                      next[optionIndex] = event.target.value;
                      updateQuestion(index, "options", next);
                    }}
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => updateQuestion(index, "options", [...question.options, ""])}
                >
                  Add option
                </Button>
              </div>
            )}

            {question.type === "TRUE_FALSE" && (
              <p className="text-sm text-muted-foreground">Accepted answers: true / false</p>
            )}

            <Input
              placeholder="Correct answer"
              value={question.correctAnswer}
              onChange={(event) => updateQuestion(index, "correctAnswer", event.target.value)}
            />

            <Button
              type="button"
              variant="destructive"
              onClick={() => setQuestions((prev) => prev.filter((_, idx) => idx !== index))}
              disabled={questions.length === 1}
            >
              Remove question
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          setQuestions((prev) => [
            ...prev,
            {
              question: "",
              type: "MULTIPLE_CHOICE",
              options: ["", ""],
              correctAnswer: "",
            },
          ])
        }
      >
        Add question
      </Button>

      <Button type="button" onClick={submit} disabled={loading}>
        {loading ? "Saving..." : "Save placement test"}
      </Button>
    </div>
  );
}
