import { buttonVariants } from "@/components/ui/button";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

const CoursesPage = () => {
  return (
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
  );
};

export default CoursesPage;
