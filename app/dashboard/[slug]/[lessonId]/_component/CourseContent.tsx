import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { useConstruct } from "@/hooks/use-construct";
import { Book, CheckCircle } from "lucide-react";

interface isAppProps {
  data: LessonContentType;
}

export function CourseContent({ data }: isAppProps) {
  function VideoPlayer({
    thumbnailKey,
    videoKey,
  }: {
    thumbnailKey: string;
    videoKey: string;
  }) {
    const videoUrl = useConstruct(videoKey);
    const thumbnailUrl = useConstruct(thumbnailKey);

    if (!videoKey) {
      return (
        <div className="aspect-video max-h-1/2 bg-muted rounded-lg flex flex-col items-center justify-center ">
          <Book className="size-16 text-primary mx-auto mb-4" />
          <p>This lesson does not have a lesson yet</p>
        </div>
      );
    }

    return (
      <div className="aspect-video max-h-3/4 bg-black rounded-lg relative overflow-hidden">
        <video
          src={videoUrl}
          className="w-full h-full object-cover"
          controls
          poster={thumbnailUrl}
        />
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer
        thumbnailKey={data.thumbnailKey ?? ""}
        videoKey={data.videoKey ?? ""}
      />

      <div className="py-4 border-b">
        <Button variant={"outline"}>
          <CheckCircle className="size-4 mr-2 text-green-500" />
          Mark as Complete
        </Button>
      </div>

      <div className="space-y-3 pt-3">
        <h1 className="text-3xl font-bold tracking-tight">{data.title}</h1>
        {data.description && (
          <RenderDescription json={JSON.parse(data.description)} />
        )}
      </div>
    </div>
  );
}
