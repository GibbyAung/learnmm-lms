import { createPlacementTest } from "@/app/data/placement/actions";
import { PlacementTestEditor } from "../_components/PlacementTestEditor";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function CreatePlacementTestPage() {
  return (
    <div className="relative space-y-6">
      <Link
        href="/admin/placement-tests"
        className={buttonVariants({
          variant: "outline",
          className: "relative",
        })}
      >
        <ArrowLeft />
        <Label>Back</Label>
      </Link>
      <h1 className="text-2xl font-bold">Create placement test</h1>
      <PlacementTestEditor mode="create" />
    </div>
  );
}
