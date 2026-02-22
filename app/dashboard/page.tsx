import EmptyState from "@/components/general/EmptyState";
import { getAllCourses } from "../data/course/get-all-courses";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import PublicCourseCard from "../(public)/_component/PublicCourseCard";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const [courses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);

  // 🔹 Compute available courses ONCE
  const availableCourses = courses.filter(
    (course) =>
      !enrolledCourses.some(
        ({ course: enrolled }) => enrolled.id === course.id,
      ),
  );

  return (
    <div className="flex flex-col gap-10">
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Your Courses</h1>
          <p className="text-muted-foreground">
            Continue learning from where you left off.
          </p>
        </div>

        {enrolledCourses.length === 0 ? (
          <EmptyState
            title="No courses available"
            description="You have not purchased any courses yet."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {enrolledCourses.map(({ course }) => (
              <Card
                key={course.id}
                className="group hover:shadow-md transition"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold">{course.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      Continue your progress
                    </p>
                  </div>

                  <Button asChild className="w-full">
                    <Link
                      href={`/dashboard/${course.slug}`}
                      className="flex items-center justify-center gap-2"
                    >
                      Open Course
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Separator />

      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Explore More Courses</h1>
          <p className="text-muted-foreground">
            Expand your skills with new topics.
          </p>
        </div>

        {availableCourses.length === 0 ? (
          <EmptyState
            title="No courses available"
            description="You have already purchased all available courses."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {availableCourses.map((course) => (
              <PublicCourseCard key={course.id} data={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
