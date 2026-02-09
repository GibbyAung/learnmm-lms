"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
  DragEndEvent,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { useEffect, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { AdminIndividualCourseType } from "@/app/data/admin/admin-get-course";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
  GripVerticalIcon,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { reorderChaptersAction, reorderLessonsAction } from "../actions";

interface isAppProps {
  data: AdminIndividualCourseType;
}

interface SortableItemProps {
  id: string;
  children: (listener: DraggableSyntheticListeners) => React.ReactNode;
  className?: string;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string;
  };
}

const CourseStructure = ({ data }: isAppProps) => {
  const initialItems =
    data.courseChapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      isOpen: true, //default chapters to open
      order: chapter.position,
      lessons: chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })),
    })) || [];

  const [items, setItems] = useState(initialItems);
  console.log(items);

  useEffect(() => {
    setItems((prevItems) => {
      const updateItems =
        data.courseChapters.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          isOpen:
            prevItems.find((items) => items.id === chapter.id)?.isOpen ?? true, //default chapters to open
          order: chapter.position,
          lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.position,
          })),
        })) || [];

      return updateItems;
    });
  }, [data.courseChapters]);

  function SortableItem({ children, id, className, data }: SortableItemProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: id, data: data });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn("touch-none", className, isDragging ? "z-10" : "")}
      >
        {children(listeners)}
      </div>
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    const activeType = active.data.current?.type as "chapter" | "lesson";
    const overType = active.data.current?.type as "chapter" | "lesson";
    const courseId = data.id;

    if (activeType === "chapter") {
      let targetChapterId = null;

      // console.log("activeType", activeType);

      if (overType === "chapter") {
        targetChapterId = overId;
      } else if (overType === "lesson") {
        targetChapterId = over.data.current?.chapterId ?? null;
      }

      if (!targetChapterId) {
        // console.log("targetChapterId", targetChapterId);
        toast.error("Could not determine target chapter for reordering");
        return;
      }

      const oldItem = items.findIndex((item) => item.id === activeId);
      const newItem = items.findIndex((item) => item.id === targetChapterId);

      if (oldItem === -1 || newItem === -1) {
        toast.error("Could not find the chapter old/new index for reordering");
        return;
      }

      const reorderLocalChapters = arrayMove(items, oldItem, newItem);

      const updatedChapterforState = reorderLocalChapters.map(
        (chapter, index) => {
          return {
            ...chapter,
            order: index + 1,
          };
        }
      );

      const previousItems = [...items];

      setItems(updatedChapterforState);

      if (courseId) {
        const latestChapterUpdate = updatedChapterforState.map((chapter) => {
          return {
            id: chapter.id,
            position: chapter.order,
          };
        });
        const reorderChaptersPromise = () =>
          reorderChaptersAction(latestChapterUpdate, courseId);

        toast.promise(reorderChaptersPromise(), {
          loading: "Reordering chapters...",
          success: (result) => {
            if (result.status === "success") return result.message;
            throw new Error(result.message);
          },
          error: () => {
            setItems(previousItems);
            return "Failed to reorder chapters";
          },
        });
      }
    }
    if (activeType === "lesson") {
      const activeLessonId = active.id;
      const overLessonId = over.id;
      const activeChapterId = active.data.current?.chapterId;

      const overChapterId = over.data.current?.chapterId;

      if (activeChapterId !== overChapterId) {
        toast.error("Cannot move lesson to another chapter");
        return;
      }

      const chapterIndex = items.findIndex(
        (item) => item.id === activeChapterId
      );

      if (chapterIndex === -1) {
        toast.error("Could not find the chapter for reordering");
        return;
      }

      const lessons = items[chapterIndex].lessons;
      const previousItem = [...items];

      const oldIndex = lessons.findIndex((item) => item.id === activeLessonId);
      const newIndex = lessons.findIndex((item) => item.id === overLessonId);

      const reorderLessons = arrayMove(lessons, oldIndex, newIndex);

      const updatedLessons = reorderLessons.map((lesson, index) => {
        return {
          ...lesson,
          order: index + 1,
        };
      });

      if (oldIndex === -1 || newIndex === -1) {
        toast.error("Could not find the lesson old/new index for reordering");
        return;
      }

      const updatedItems = [...items];
      updatedItems[chapterIndex].lessons = updatedLessons;

      setItems(updatedItems);

      if (courseId) {
        const latestLessonUpdate = updatedLessons.map((lesson) => {
          return {
            id: lesson.id,
            position: lesson.order,
          };
        });
        const reorderLessonPromise = () =>
          reorderLessonsAction(activeChapterId, latestLessonUpdate, courseId);

        toast.promise(reorderLessonPromise(), {
          loading: "Reordering Lessons...",
          success: (result) => {
            if (result.status === "success") return result.message;
            throw new Error(result.message);
          },
          error: () => {
            setItems(previousItem);
            return "Failed to reorder lessons";
          },
        });
      }
    }
  }

  function toggleChapter(chapterId: string) {
    setItems((items) => {
      return items.map((item) => {
        if (item.id === chapterId) {
          return { ...item, isOpen: !item.isOpen };
        }
        return item;
      });
    });
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 justify-between border-b border-border">
          <CardTitle>Chapter</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <SortableContext strategy={verticalListSortingStrategy} items={items}>
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                data={{ type: "chapter" }}
              >
                {(listeners) => (
                  <Card>
                    <Collapsible
                      open={item.isOpen}
                      onOpenChange={() => toggleChapter(item.id)}
                    >
                      <div className="flex items-center justify-between px-5 py-2 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Button
                            variant={"ghost"}
                            size={"icon"}
                            {...listeners}
                          >
                            <GripVertical className="size-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost">
                              {item.isOpen ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <p className="text-sm text-primary">{item.title}</p>
                        </div>
                        <Button size={"icon"} variant={"outline"}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <CollapsibleContent className="p-3">
                        <div>
                          <SortableContext
                            items={item.lessons.map((lesson) => lesson.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {item.lessons.map((lesson, i) => (
                              <SortableItem
                                key={lesson.id}
                                id={lesson.id}
                                data={{ type: "lesson", chapterId: item.id }}
                              >
                                {(lessonListeners) => (
                                  <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant={"ghost"}
                                        size={"icon"}
                                        {...lessonListeners}
                                      >
                                        <GripVertical className="size-4" />
                                      </Button>
                                      <FileText className="size-4" />

                                      <Link
                                        href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}
                                      >
                                        <p className="text-sm text-primary">
                                          {lesson.title}
                                        </p>
                                      </Link>
                                    </div>
                                    <Button variant={"outline"} size={"icon"}>
                                      {" "}
                                      <Trash2 className="size-4" />
                                    </Button>
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                          <div className="p-2">
                            <Button
                              className="w-full"
                              variant={"outline"}
                              size={"sm"}
                            >
                              Add Lesson
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
};

export default CourseStructure;
