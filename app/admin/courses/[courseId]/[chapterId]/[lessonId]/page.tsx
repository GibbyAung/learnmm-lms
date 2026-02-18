import { adminGetLesson } from "@/app/data/admin/admin-get-lesson";
import React from "react";
import LessonForm from "./_component/LessonForm";

type Params = Promise<{
  courseId: string;
  chapterId: string;
  lessonId: string;
}>;

const LessonIdPage = async ({ params }: { params: Params }) => {
  const { courseId, chapterId, lessonId } = await params;
  const lesson = await adminGetLesson(lessonId);

  return <LessonForm chapterId={chapterId} data={lesson} courseId={courseId} />;
};

export default LessonIdPage;
