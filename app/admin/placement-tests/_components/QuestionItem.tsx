import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PlacementTestSchemaType } from "@/lib/zodSchemas";
import { Trash2 } from "lucide-react";

import { Controller, UseFormReturn, useWatch } from "react-hook-form";
import { Uploader } from "@/components/file-uploader/Uploader";

type QuestionItemProps = {
  index: number;
  form: UseFormReturn<PlacementTestSchemaType>;
  removeQuestion: (index: number) => void;
};

export default function QuestionItem({
  index,
  form,
  removeQuestion,
}: QuestionItemProps) {
  const question = useWatch({
    control: form.control,
    name: `questions.${index}`,
  });
  const options = question?.options ?? [];
  const type = question?.type;
  console.log("Options: ", options, "Type:", type, "And Index", index);
  return (
    <div className="flex flex-col gap-3">
      <Controller
        name={`questions.${index}.question`}
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-2">
            <Label className="text-lg font-medium mb-2">
              Question {index + 1}
            </Label>
            <Input {...field} />
            {fieldState.error && (
              <p className="text-xs text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      {/* Image Upload */}
      <Controller
        name={`questions.${index}.imageUrl`}
        control={form.control}
        render={({ field }) => {
          console.log(`Question ${index} imageUrl field.value:`, field.value);
          return (
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Image (Optional)</Label>
              <Uploader
                fileTypeAccepted="image"
                value={field.value ?? ""}
                onChange={(value) => {
                  console.log(`Question ${index} onChange value:`, value);
                  field.onChange(value);
                }}
              />
            </div>
          );
        }}
      />

      <Controller
        name={`questions.${index}.type`}
        control={form.control}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);

              if (value === "TRUE_FALSE") {
                form.setValue(`questions.${index}.options`, ["true", "false"], {
                  shouldDirty: true,
                });
                form.setValue(`questions.${index}.correctAnswer`, "", {
                  shouldDirty: true,
                });
              }

              if (value === "MULTIPLE_CHOICE") {
                form.setValue(
                  `questions.${index}.options`,
                  ["Option 1", "Option 2"],
                  { shouldDirty: true },
                );

                form.setValue(`questions.${index}.correctAnswer`, "", {
                  shouldDirty: true,
                });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select question type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
              <SelectItem value="TRUE_FALSE">True / False</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      {/* Options Part */}
      {type === "MULTIPLE_CHOICE" && (
        <>
          {options.map((_, optionIndex) => (
            <Controller
              key={optionIndex}
              name={`questions.${index}.options.${optionIndex}`}
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1 ml-2">
                  <Label className="text-xs text-muted-foreground">
                    Option {optionIndex + 1}
                  </Label>

                  <div className="flex flex-row">
                    <Input
                      {...field}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        const oldValue = field.value;

                        field.onChange(newValue);

                        const currentCorrect = form.getValues(
                          `questions.${index}.correctAnswer`,
                        );

                        if (currentCorrect === oldValue) {
                          form.setValue(
                            `questions.${index}.correctAnswer`,
                            newValue,
                            { shouldDirty: true },
                          );
                        }
                      }}
                    />
                    {fieldState.error && (
                      <p className="text-xs text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const currentOptions =
                          form.getValues(`questions.${index}.options`) ?? [];

                        const removedOptionValue = currentOptions[optionIndex];

                        const updated = currentOptions.filter(
                          (_, i) => i !== optionIndex,
                        );

                        const currentCorrect = form.getValues(
                          `questions.${index}.correctAnswer`,
                        );

                        if (currentCorrect === removedOptionValue) {
                          form.setValue(
                            `questions.${index}.correctAnswer`,
                            "",
                            { shouldDirty: true },
                          );
                        }

                        form.setValue(`questions.${index}.options`, updated, {
                          shouldDirty: true,
                        });
                      }}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              )}
            />
          ))}

          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const currentOptions =
                  form.getValues(`questions.${index}.options`) ?? [];

                form.setValue(
                  `questions.${index}.options`,
                  [...currentOptions, `Option ${currentOptions.length + 1}`],
                  { shouldDirty: true },
                );
              }}
            >
              Add Option
            </Button>
          </div>
        </>
      )}

      {type === "MULTIPLE_CHOICE" && (
        <Controller
          name={`questions.${index}.correctAnswer`}
          control={form.control}
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <Label className="px-1 py-2 text-primary/70">
                Choose correct answer:
              </Label>

              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select correct answer" />
                </SelectTrigger>

                <SelectContent>
                  {options
                    .filter((option) => option.trim() !== "")
                    .map((option, i) => (
                      <SelectItem key={i} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />
      )}

      {type === "TRUE_FALSE" && (
        <Controller
          name={`questions.${index}.correctAnswer`}
          control={form.control}
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <Label className="px-1 py-2 text-primary/70">
                Choose correct answer:
              </Label>

              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select correct answer" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="true">True</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
      )}
      <div>
        <Button
          type="button"
          variant="destructive"
          onClick={() => removeQuestion(index)}
        >
          Remove Question
        </Button>
      </div>
      <Separator className="my-6" />
    </div>
  );
}
