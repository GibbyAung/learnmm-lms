// app/dashboard/[slug]/layout.tsx

import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar";
import CourseSidebar from "../_component/CourseSidebar";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface CourseLayoutProps {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export default async function CourseLayout({
  params,
  children,
}: CourseLayoutProps) {
  const { slug } = await params;

  const data = await getCourseSidebarData(slug);
  const { course } = data;

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-80 border-r bg-background">
        <CourseSidebar course={course} />
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between border-b p-4">
          <h2 className="font-semibold truncate">{course.title}</h2>

          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="p-0 w-80">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="hidden">{course.title}</SheetTitle>
                <SheetDescription>Course navigation</SheetDescription>
              </SheetHeader>

              <CourseSidebar course={course} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
