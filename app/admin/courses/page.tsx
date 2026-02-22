import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import Link from "next/link";
import React, { Suspense } from "react";
import {
  AdminCourseCard,
  AdminCourseCardSkeleton,
} from "./_component/AdminCourseCard";
import EmptyState from "@/components/general/EmptyState";

const CoursesPage = async () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>

        <Link
          href="/admin/courses/create"
          className={buttonVariants({ variant: "default" })}
        >
          <IconCirclePlusFilled />
          <span>Quick Create</span>
        </Link>
      </div>

      <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </>
  );
};

async function RenderCourses() {
  const courses = await adminGetCourses();

  return (
    <>
      {courses.length === 0 ? (
        <EmptyState title="No Courses Found" description="Create a course" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {courses.map((course) => (
            <AdminCourseCard key={course.id} data={course} />
          ))}
        </div>
      )}
    </>
  );
}

function AdminCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
      {Array.from({ length: 4 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default CoursesPage;
