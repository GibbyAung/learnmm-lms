import { Ban } from "lucide-react";
import React from "react";

const EmptyState = () => {
  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center rounded-md border-dashed border p-8 text-center animate-in fade-in">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
        <Ban className="size-10 text-primary" />
      </div>
      <h3 className="mt-4 text-sm font-semibold">No courses found</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Create a course to get started
      </p>
    </div>
  );
};

export default EmptyState;
