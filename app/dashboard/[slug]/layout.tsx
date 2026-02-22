import { ReactNode } from "react";
import CourseSidebar from "../_component/CourseSidebar";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar";

interface isAppProps {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}

export default async function CourseLayout({ params, children }: isAppProps) {
  const { slug } = await params;
  const course = await getCourseSidebarData(slug);
  return (
    <div className="flex flex-1">
      {/* Sidebar */}
      <div className="w-80 border-r border-border shrink-0">
        <CourseSidebar course={course.course} />
      </div>
      {/* Main Content */}

      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
