import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstruct } from "@/hooks/use-construct";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  ArrowRight,
  Eye,
  MoreVertical,
  Pencil,
  School,
  TimerIcon,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface isAppProps {
  data: AdminCourseType;
}

export const AdminCourseCard = ({ data }: isAppProps) => {
  const thumbnailURL = useConstruct(data.fileKey);
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"secondary"} size={"icon"}>
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 ">
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/edit`}>
                <Pencil className="size-4 mr-2" />
                Edit Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.slug}`}>
                <Eye className="size-4 mr-2" />
                Preview
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/delete`}>
                <Trash2 className="size-4 mr-2 text-destructive" />
                <span className="text-destructive">Delete Course</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative w-full aspect-video">
        <Image
          src={thumbnailURL}
          alt="Thumbnail"
          fill
          className="rounded-t-lg object-cover"
        />
      </div>

      <CardContent className="p-4">
        <Link
          href={`/admin/courses/${data.id}/edit`}
          className="font-medium line-clamp-2 text-lg hover:underline group-hover:text-primary transition-colors"
        >
          <h1 className="text-xl font-bold mt-2">{data.title}</h1>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-tight mt-2">
          {data.smallDescription}
        </p>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md bg-primary/10 text-primary" />
            <span className="text-sm text-muted-foreground">
              {data.duration}h
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            <School className="size-6 p-1 rounded-md bg-primary/10 text-primary" />
            <span className="text-sm text-muted-foreground">{data.level}</span>
          </div>
        </div>

        <Link
          href={`/admin/courses/${data.id}/edit`}
          className={buttonVariants({ className: "mt-4 w-full" })}
        >
          Edit Course <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
};

export function AdminCourseCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <Skeleton className="size-9 rounded-md" />
      </div>
      <div className="relative w-full aspect-video">
        <Skeleton className="absolute inset-0 rounded-t-lg" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="h-7 w-3/4 mt-2 mb-2 rounded" />
        <Skeleton className="h-4 w-full mt-2 mb-4 rounded" />

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
        </div>

        <Skeleton className="h-10 w-full mt-4 rounded" />
      </CardContent>
    </Card>
  );
}
