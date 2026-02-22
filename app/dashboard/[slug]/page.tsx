// app/dashboard/[slug]/page.tsx

import Link from "next/link";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface DashboardCoursePageProps {
  params: Promise<{ slug: string }>;
}

export default async function DashboardCoursePage({
  params,
}: DashboardCoursePageProps) {
  const { slug } = await params;

  const data = await getCourseSidebarData(slug);

  if (!data?.course) {
    return notFound();
  }

  const { course } = data;

  const totalLessons = course.courseChapters.reduce(
    (acc, chapter) => acc + chapter.lessons.length,
    0,
  );

  const firstLesson = course.courseChapters?.[0]?.lessons?.[0];

  // Fake progress for now (replace later with real progress)
  const progressPercentage = 0;

  return (
    <div className="flex flex-col gap-10 p-8 max-w-6xl mx-auto">
      {/* HERO SECTION */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{course.title}</h1>

        <div className="flex gap-3 flex-wrap">
          <Badge variant="secondary">{course.category}</Badge>
          <Badge variant="secondary">{course.level}</Badge>
          <Badge variant="secondary">{course.duration} hours</Badge>
          <Badge variant="outline">{totalLessons} lessons</Badge>
        </div>

        <p className="text-muted-foreground max-w-2xl">
          Continue your journey and complete this course at your own pace.
        </p>
      </div>

      <Separator />

      {/* PROGRESS SECTION */}
      <Card className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Your Progress</h3>
            <p className="text-sm text-muted-foreground">
              Track your learning journey
            </p>
          </div>

          <span className="text-sm font-medium">{progressPercentage}%</span>
        </div>

        <Progress value={progressPercentage} />

        {firstLesson && (
          <Button asChild size="lg" className="w-fit">
            <Link href={`/dashboard/${slug}/${firstLesson.id}`}>
              {progressPercentage > 0 ? "Continue Learning" : "Start Course"}
            </Link>
          </Button>
        )}
      </Card>

      {/* QUICK INFO CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <CardContent className="space-y-2 p-0">
            <p className="text-sm text-muted-foreground">Total Chapters</p>
            <p className="text-2xl font-bold">{course.courseChapters.length}</p>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardContent className="space-y-2 p-0">
            <p className="text-sm text-muted-foreground">Total Lessons</p>
            <p className="text-2xl font-bold">{totalLessons}</p>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardContent className="space-y-2 p-0">
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="text-2xl font-bold">{course.duration}h</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
