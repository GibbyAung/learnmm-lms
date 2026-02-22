"use client";

import { Button } from "@/components/ui/button";
import {
  Categories,
  CourseLevels,
  CourseScehmaType,
  courseSchema,
  CourseStatus,
} from "@/lib/zodSchemas";
import { Loader2, PlusCircleIcon, SparkleIcon } from "lucide-react";
import React, { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FieldGroup } from "@/components/ui/field";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Uploader } from "@/components/file-uploader/Uploader";
import { tryCatch } from "@/hooks/try-catch";
import { useRouter } from "next/navigation";
import { editCourse } from "../actions";
import { AdminIndividualCourseType } from "@/app/data/admin/admin-get-course";
import { prepareFormDefaults } from "@/lib/transformCase";
import dynamic from "next/dynamic";

const Tiptap = dynamic(() => import("@/components/rich-text-editor/tiptap"), {
  ssr: false,
});

interface isAppProps {
  data: AdminIndividualCourseType;
}

const EditCourseForm = ({ data }: isAppProps) => {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<CourseScehmaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: prepareFormDefaults(data),
  });

  function onSubmit(values: CourseScehmaType) {
    toast("You submitted the following values:", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>
            {JSON.stringify(
              values, // (also: you used `data` in the snippet—make sure you stringify the object you intend)
              (key, value) => {
                const blockedKeys = new Set([
                  "fileKey",
                  "description",
                  "slug",
                  "id",
                  "courseChapter", // if it exists somewhere
                  "courseChapters", // <-- this is the important one
                  "lessons", // <-- if nested lessons should be hidden too
                ]);

                if (blockedKeys.has(key)) return undefined;
                return value;
              },
              2,
            )}
          </code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        editCourse(values, data.id),
      );

      if (error) {
        toast.error("Unexpected error occured. Please try again");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        router.push("/admin/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Title</label>
                <input
                  {...field} // value, onChange, onBlur, name, ref
                  className="border rounded px-2 py-1"
                  placeholder="Enter course title"
                />
                {fieldState.error && (
                  <p className="text-xs text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </FieldGroup>
        <FieldGroup>
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Description</label>
                <Tiptap field={field} />
                {fieldState.error && (
                  <p className="text-xs text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </FieldGroup>
        <FieldGroup>
          <Controller
            name="fileKey"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Thumbnail Image</label>
                <Uploader
                  onChange={field.onChange}
                  value={field.value}
                  fileTypeAccepted="image"
                />
                {fieldState.error && (
                  <p className="text-xs text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </FieldGroup>

        <div className="grid grid-cols-2 gap-4 items-end relative">
          <FieldGroup>
            <Controller
              name="slug"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Slug</label>
                  <input
                    {...field} // value, onChange, onBlur, name, ref
                    className="border rounded px-2 py-1"
                    placeholder="Enter slug"
                  />
                  {fieldState.error && (
                    <p className="text-xs text-red-500 absolute -bottom-5">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </FieldGroup>
          <Button
            type="button"
            className="w-fit"
            onClick={() => {
              const slug = slugify(form.getValues("title"), {
                lower: true,
              });
              form.setValue("slug", slug, { shouldValidate: true });
            }}
          >
            Generate Slug <SparkleIcon className="size-sm" />
          </Button>
        </div>

        <FieldGroup>
          <Controller
            name="smallDescription"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Small Description</label>
                <Textarea
                  {...field} // value, onChange, onBlur, name, ref
                  className="border rounded px-2 py-1"
                  placeholder="Enter small description"
                />
                {fieldState.error && (
                  <p className="text-xs text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldGroup>
            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error &&
                    fieldState.error.message &&
                    fieldState.error.message.split(",").map((err, index) => (
                      <p key={index} className="text-xs text-red-500">
                        {err}
                      </p>
                    ))}
                </div>
              )}
            />
          </FieldGroup>
          <FieldGroup>
            <Controller
              name="level"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Level</label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CourseLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error &&
                    fieldState.error.message &&
                    fieldState.error.message.split(",").map((err, index) => (
                      <p key={index} className="text-xs text-red-500">
                        {err}
                      </p>
                    ))}
                </div>
              )}
            />
          </FieldGroup>
          <FieldGroup>
            <Controller
              name="duration"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">
                    Duration (hours)
                  </label>
                  <Input
                    {...field} // value, onChange, onBlur, name, ref
                    className="border rounded px-2 py-1"
                    placeholder="Enter duration"
                    type="number"
                  />
                  {fieldState.error && (
                    <p className="text-xs text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </FieldGroup>
          <FieldGroup>
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Price ($)</label>
                  <Input
                    {...field} // value, onChange, onBlur, name, ref
                    className="border rounded px-2 py-1"
                    placeholder="Enter price"
                    type="number"
                  />
                  {fieldState.error && (
                    <p className="text-xs text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </FieldGroup>
        </div>

        <FieldGroup>
          <Controller
            name="status"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Status</label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {CourseStatus.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error &&
                  fieldState.error.message &&
                  fieldState.error.message.split(",").map((err, index) => (
                    <p key={index} className="text-xs text-red-500">
                      {err}
                    </p>
                  ))}
              </div>
            )}
          />
        </FieldGroup>

        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              Updating ...
              <Loader2 className="size-4 animate-spin" />
            </>
          ) : (
            <>
              Update Course
              <PlusCircleIcon className="ml-1 mb-0.5" size={14} />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default EditCourseForm;
