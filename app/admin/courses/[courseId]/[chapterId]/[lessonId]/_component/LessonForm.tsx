"use client";

import { AdminLessonType } from "@/app/data/admin/admin-get-lesson";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";

import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Tiptap from "@/components/rich-text-editor/tiptap";
import { Uploader } from "@/components/file-uploader/Uploader";
import { updateLesson } from "../action";

interface isAppProps {
  data: AdminLessonType;
  chapterId: string;
  courseId: string;
}

const LessonForm = ({ data, chapterId, courseId }: isAppProps) => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: data.title,
      courseId: courseId,
      chapterId: chapterId,
      description: data.description ?? undefined,
      videoKey: data.videoKey ?? undefined,
      thumbnailKey: data.thumbnailKey ?? undefined,
    },
  });

  function onSubmit(values: LessonSchemaType) {
    // toast("You submitted the following values:", {
    //   description: (
    //     <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
    //       <code>
    //         {JSON.stringify(
    //           data,
    //           (key, value) => {
    //             if (key === "fileKey" || key === "description") {
    //               return undefined;
    //             }
    //             return value;
    //           },
    //           2
    //         )}
    //       </code>
    //     </pre>
    //   ),
    //   position: "bottom-right",
    //   classNames: {
    //     content: "flex flex-col gap-2",
    //   },
    //   style: {
    //     "--border-radius": "calc(var(--radius)  + 4px)",
    //   } as React.CSSProperties,
    // });
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        updateLesson(values, data.id),
      );
      if (error) {
        toast.error("Unexpected error occured. Please try again");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <div className="space-y-6">
      <Link
        className={buttonVariants({ variant: "outline", className: "mb-6" })}
        href={`/admin/courses/`}
      >
        <ArrowLeft size={16} /> <span>Go Back</span>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Edit your lesson</CardTitle>
          <CardDescription>
            Configure the video and description for this lesson
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Controller
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Name</FormLabel>
                    <Input placeholder="Hello Chapter" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Controller
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Description</FormLabel>
                    <Tiptap field={field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Controller
                control={form.control}
                name="thumbnailKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Thumbnail</FormLabel>
                    <Uploader
                      onChange={field.onChange}
                      value={field.value}
                      fileTypeAccepted="image"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Controller
                control={form.control}
                name="videoKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Video File</FormLabel>
                    <Uploader
                      onChange={field.onChange}
                      value={field.value}
                      fileTypeAccepted="video"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={isPending}
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
              >
                {isPending ? "Saving..." : "Save Lessons"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonForm;
