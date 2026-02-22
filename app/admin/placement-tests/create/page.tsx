import { createPlacementTest } from "@/app/data/placement/actions";
import { PlacementTestEditor } from "../_components/PlacementTestEditor";

export default function CreatePlacementTestPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create placement test</h1>
      <PlacementTestEditor onSubmit={createPlacementTest} />
    </div>
  );
}
