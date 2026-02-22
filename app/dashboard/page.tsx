import EmptyState from "@/components/general/EmptyState";
import { getAllCourses } from "../data/course/get-all-courses";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import PublicCourseCard from "../(public)/_component/PublicCourseCard";
import Link from "next/link";

export default async function DashboardPage() {
  const [courses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Enrolled Courses</h1>
        <p className="text-muted-foreground">
          Here you can see all the courses you have access to.
        </p>
      </div>

      {enrolledCourses.length === 0 ? (
        <EmptyState
          title={"No courses available"}
          description="You have not purchased any courses yet."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolledCourses.map((course) => (
            <Link
              key={course.course.id}
              href={`/dashboard/${course.course.slug}`}
            >
              {course.course.title}
            </Link>
          ))}
        </div>
      )}

      <section className="mt-5">
        <div className="flex flex-col gap-2 mb-5">
          <h1 className="text-3xl font-bold">Available Courses</h1>
          <p className="text-muted-foreground">
            Here you can see all the courses you can purchase.
          </p>
        </div>

        {courses.filter(
          (course) =>
            !enrolledCourses.some(
              ({ course: enrolled }) => enrolled.id === course.id,
            ),
        ).length === 0 ? (
          <EmptyState
            title="No courses Available"
            description="You have already purchased all available courses"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses
              .filter(
                (course) =>
                  !enrolledCourses.some(
                    ({ course: enrolled }) => enrolled.id === course.id,
                  ),
              )
              .map((course) => (
                <PublicCourseCard key={course.id} data={course} />
              ))}
          </div>
        )}
      </section>
    </>
  );
}
