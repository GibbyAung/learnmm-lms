import { getAllCourses } from "@/app/data/course/get-all-courses";
import React, { Suspense } from "react";
import PublicCourseCard, {
  PublicCourseCardSkeleton,
} from "../_component/PublicCourseCard";

const PublicCoursesRoute = () => {
  return (
    <div className="mt-5">
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl fontbold tracking-tight">
          Explore Courses
        </h1>
        <p className="text-sm text-muted-foreground">
          Discover our wide range of courses designed to help you acheieve your
          learning goals.
        </p>
      </div>

      <Suspense fallback={<LoadingSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
};

async function RenderCourses() {
  const courses = await getAllCourses();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <PublicCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function LoadingSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
      {Array.from({ length: 3 }).map((_, index) => (
        <PublicCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default PublicCoursesRoute;
