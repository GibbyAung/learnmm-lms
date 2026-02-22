import { cn } from "@/lib/utils";
import { CloudUpload, ImageIcon, Loader2, XIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

const RenderEmptyState = ({ isDragActive }: { isDragActive: boolean }) => {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 mb-2">
        <CloudUpload
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary",
          )}
        />
      </div>
      <p className="text-based text-foreground font-semibold">
        Drop your files here or{" "}
        <span className="text-primary font-bold">Click to Upload</span>
      </p>
    </div>
  );
};

export default RenderEmptyState;

export const RenderErrorState = () => {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 bg-destructive/30 mb-4">
        <ImageIcon className={cn("size-6 text-destructive")} />
      </div>

      <p className="text-base font-semibold ">Upload failed</p>
      <p className="text-sm text-muted-foreground mt-4">Please try again</p>
    </div>
  );
};

export const RenderUploadedState = ({
  previewURL,
  isDeleting,
  handleRemoveFile,
  fileType,
}: {
  previewURL: string;
  isDeleting: boolean;
  handleRemoveFile: () => void;
  fileType?: "image" | "video";
}) => {
  return (
    <div className="relative group w-full h-full flex items-center justify-center">
      {fileType === "video" ? (
        <video
          src={previewURL}
          controls
          className="rounded-md w-full h-full "
        />
      ) : (
        <Image
          src={previewURL}
          alt="preview"
          className="object-contain p-2"
          width={225}
          height={225}
        />
      )}
      <Button
        type="button"
        variant={"destructive"}
        size="sm"
        className={cn("absolute top-4 right-4")}
        onClick={handleRemoveFile}
        disabled={isDeleting}
      >
        {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <XIcon />}
      </Button>
    </div>
  );
};

export const RenderUploadingState = ({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) => {
  return (
    <div className="text-center flex justify-center flex-col">
      <p className="mt-2 text-sm font-medium text-foreground">
        Uploading {file.name}
      </p>
    </div>
  );
};
