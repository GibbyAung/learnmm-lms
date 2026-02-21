import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstruct } from "@/hooks/use-construct";
import { TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface isAppProps {
  data: PublicCourseType;
}

const PublicCourseCard = ({ data }: isAppProps) => {
  const thumbnailURL = useConstruct(data.fileKey);
  return (
    <div>
      <Card className="group relative py-0 gap-0">
        <Badge className="absolute top-2 right-2 z-10">{data.level}</Badge>
        <Image
          src={thumbnailURL}
          width={600}
          height={400}
          alt="Thumbnail Image of Course"
          className="w-full rounded-t-xl aspect-video h-full object-conver"
        />
        <CardContent className="p-4">
          <Link
            className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
            href={`/courses/${data.slug}`}
          >
            {data.title}
          </Link>
          <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
            {data.smallDescription}
          </p>
          <div className="mt-4 flex items-center gap-x-5">
            <div className="flex items-center gap-x-2">
              <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
              <p className="text-sm text-muted-foreground">{data.duration}h</p>
            </div>
            <div className="flex items-center gap-x-2">
              <p className="text-sm text-muted-foreground">{data.category}</p>
            </div>
          </div>

          <Link
            className={buttonVariants({
              variant: "default",
              className: "w-full mt-4",
            })}
            href={`/courses/${data.slug}`}
          >
            {" "}
            Learn More{" "}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicCourseCard;

export function PublicCourseCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 flex items-center">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="w-full relative h-fit">
        <Skeleton className="w-full rounded-t-xl aspect-video" />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-full " />
          <Skeleton className="h-6 w-3/4 " />
        </div>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>

        <Skeleton className="w-full h-10 mt-4 rounded-md" />
      </CardContent>
    </Card>
  );
}
