"use client";

import React, { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import RenderEmptyState, {
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useConstruct } from "@/hooks/use-construct";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string | null;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string | null;
  fileType?: "image" | "video";
}

interface isAppProps {
  value?: string;
  onChange?: (value: string) => void;
  fileTypeAccepted: "image" | "video";
}

export const Uploader = ({ onChange, value, fileTypeAccepted }: isAppProps) => {
  const fileUrl = useConstruct(value || "");
  const [fileState, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    error: false,
    fileType: fileTypeAccepted,
    key: value || null,
    objectUrl: value ? fileUrl : undefined,
  });

  const uploadFile = useCallback(
    async (file: File) => {
      setFileState((prev) => ({
        ...prev,
        uploading: true,
        progress: 0,
      }));

      try {
        //Step 1: Pre-signed URL
        const preSignedResponse = await fetch("/api/s3/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            isImage: fileTypeAccepted === "image" ? true : false,
          }),
        });

        if (!preSignedResponse.ok) {
          toast.error("Failed to get Pre-Signed URL");

          setFileState((prev) => ({
            ...prev,
            uploading: false,
            progress: 0,
            error: true,
          }));

          return;
        }

        const { presignedUrl, key } = await preSignedResponse.json();

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentageCompleted = (event.loaded / event.total) * 100;

              setFileState((prev) => ({
                ...prev,
                progress: Math.round(percentageCompleted),
              }));
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 400) {
              setFileState((prev) => ({
                ...prev,
                progress: 100,
                uploading: false,
                key: key,
              }));

              onChange?.(key);

              toast.success("File Uploaded Successfully");

              resolve();
            } else {
              reject(new Error("Upload Failed...."));
            }
          };

          xhr.onerror = () => {
            reject(new Error("Upload Failed...."));
          };

          xhr.open("PUT", presignedUrl);

          xhr.send(file);
        });
      } catch {
        toast.error("Something went wrong");

        setFileState((prev) => ({
          ...prev,
          progress: 0,
          error: true,
          uploading: false,
        }));
      }
    },
    [fileTypeAccepted, onChange],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Do something with the files
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }
        setFileState({
          file: file,
          uploading: false,
          progress: 0,
          objectUrl: URL.createObjectURL(file),
          fileType: fileTypeAccepted,
          id: uuidv4(), // Generate a unique ID using uuidv4(),
          isDeleting: false,
          error: false,
        });

        uploadFile(file);
      }
    },
    [fileState.objectUrl, uploadFile, fileTypeAccepted],
  );

  async function handleRemoveFile() {
    if (fileState.isDeleting || !fileState.objectUrl) return;
    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: fileState.key,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to remove the file from storage");

        setFileState((prev) => ({
          ...prev,
          isDeleting: true,
          error: true,
        }));

        return;
      }

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      onChange?.("");

      setFileState(() => ({
        id: null,
        file: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        error: false,
        fileType: fileTypeAccepted,
      }));

      toast.success("Removed file successfully");
    } catch {
      toast.error("Failed to remove the file");

      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }));
    }
  }

  function renderContent() {
    if (fileState.uploading) {
      return (
        <RenderUploadingState
          file={fileState.file as File}
          progress={fileState.progress}
        />
      );
    }

    if (fileState.error) {
      return <RenderErrorState />;
    }

    if (fileState.objectUrl) {
      return (
        <RenderUploadedState
          previewURL={fileState.objectUrl}
          handleRemoveFile={handleRemoveFile}
          isDeleting={fileState.isDeleting}
          fileType={fileState.fileType}
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
  }

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      fileTypeAccepted === "video" ? { "video/*": [] } : { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize:
      fileTypeAccepted === "image" ? 5 * 1024 * 1024 : 5000 * 1024 * 1024,
    onDropRejected: (fileRejection: FileRejection[]) => {
      if (fileRejection.length > 0) {
        const tooMany = fileRejection.find(
          (rejection) => rejection.errors[0].code === "too-many-files",
        );
        if (tooMany) {
          toast.error("You can only upload one file at a time.");
        }
        const tooLarge = fileRejection.find(
          (rejection) => rejection.errors[0].code === "file-too-large",
        );
        if (tooLarge) {
          toast.error(
            `File size must be less than ${fileTypeAccepted === "image" ? "5MB" : "500MB"}.`,
          );
        }
      }
    },
    disabled: fileState.uploading || !!fileState.objectUrl,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed duration-200 w-full h-64 transition-colors",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary",
      )}
    >
      <CardContent className="flex items-center justify-center h-full w-full p-4">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
};
