"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Categories,
  CourseLevels,
  CourseScehmaType,
  courseSchema,
  CourseStatus,
} from "@/lib/zodSchemas";
import {
  ArrowLeft,
  Loader,
  Loader2,
  PlusCircleIcon,
  PlusIcon,
  SparkleIcon,
} from "lucide-react";
import Link from "next/link";
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
import Tiptap from "@/components/rich-text-editor/tiptap";
import { Uploader } from "@/components/file-uploader/Uploader";
import { tryCatch } from "@/hooks/try-catch";
import { CreateCourse } from "./actions";
import { useRouter } from "next/navigation";

const CourseCreationPage = () => {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<CourseScehmaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      fileKey: "",
      price: 0,
      duration: 0,
      level: "Beginner",
      category: "Health and Fitness",
      smallDescription: "",
      slug: "",
      status: "Draft",
    },
  });

  function onSubmit(data: CourseScehmaType) {
    toast("You submitted the following values:", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>
            {JSON.stringify(
              data,
              (key, value) => {
                if (key === "fileKey" || key === "description") {
                  return undefined;
                }
                return value;
              },
              2
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
      const { data: result, error }: any = await tryCatch(CreateCourse(data));

      if (error) {
        toast.error("Unexpected error occured. Please try again");
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
    <>
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ArrowLeft />
        </Link>
        <h1 className="text-lg font-bold">Create Course</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Provide Basic Information about the course
          </CardDescription>
        </CardHeader>

        <CardContent>
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
                    <label className="text-sm font-medium">
                      Thumbnail Image
                    </label>
                    <Uploader onChange={field.onChange} value={field.value} />
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
                    <label className="text-sm font-medium">
                      Small Description
                    </label>
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
                        fieldState.error.message
                          .split(",")
                          .map((err, index) => (
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
                        fieldState.error.message
                          .split(",")
                          .map((err, index) => (
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
                  Creating ...
                  <Loader2 className="size-4 animate-spin" />
                </>
              ) : (
                <>
                  Create Course
                  <PlusCircleIcon className="ml-1 mb-0.5" size={14} />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default CourseCreationPage;
