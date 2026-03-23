"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { placementTestSchema, PlacementTestSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import QuestionItem from "./QuestionItem";
import { useTransition } from "react";
import { ApiReponse } from "@/lib/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { tryCatch } from "@/hooks/try-catch";
import {
  createPlacementTest,
  updatePlacementTest,
} from "@/app/data/placement/actions";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Props =
  | {
      mode: "create";
    }
  | {
      mode: "edit";
      testId: string;
      initialValue: PlacementTestSchemaType;
    };

export function PlacementTestEditor(props: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<PlacementTestSchemaType>({
    resolver: zodResolver(placementTestSchema),
    defaultValues:
      props.mode === "edit"
        ? props.initialValue
        : {
            title: "",
            description: "",
            questions: [
              {
                question: "",
                imageUrl: undefined,
                type: "MULTIPLE_CHOICE",
                correctAnswer: "",
                options: ["", ""],
              },
            ],
          },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const onSubmit = (values: PlacementTestSchemaType) => {
    console.log("SUBMIT TRIGGERED", values);
    startTransition(async () => {
      let result;

      if (props.mode === "create") {
        result = await createPlacementTest(values);
      } else {
        result = await updatePlacementTest(props.testId, values);
      }

      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        router.push("/admin/placement-tests");
      } else {
        toast.error(result.message);
      }
    });
  };

  const buttonLabel = isPending
    ? props.mode === "create"
      ? "Creating..."
      : "Updating..."
    : props.mode === "create"
      ? "Create Placement Test"
      : "Update Placement Test";

  return (
    <div className="space-y-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Test details</CardTitle>
          <CardDescription>Make your placement test here</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log("Validation Error:", errors);
            })}
          >
            <div className="flex flex-col gap-2">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-2">
                    <Label>Title</Label>
                    <Input {...field} />
                    {fieldState.error && (
                      <p className="text-xs text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
              {fields.map((questionField, index) => (
                <QuestionItem
                  key={questionField.id}
                  // fieldId={questionField.id}
                  index={index}
                  form={form}
                  removeQuestion={remove}
                />
              ))}

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() =>
                    append({
                      question: "",
                      type: "MULTIPLE_CHOICE",
                      options: ["Option 1", "Option 2"],
                      correctAnswer: "",
                    })
                  }
                >
                  Add Question
                </Button>
                <Button type="submit" disabled={isPending}>
                  {buttonLabel}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
