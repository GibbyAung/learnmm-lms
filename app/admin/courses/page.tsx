import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { AdminCourseCard } from "./_component/AdminCourseCard";

const CoursesPage = async () => {
  const courses = await adminGetCourses();
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
        {courses.map((course) => (
          <AdminCourseCard key={course.id} data={course} />
        ))}
      </div>
    </>
  );
};

export default CoursesPage;
