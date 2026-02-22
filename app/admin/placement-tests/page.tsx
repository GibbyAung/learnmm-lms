import { adminGetPlacementTests } from "@/app/data/placement/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function PlacementTestsPage() {
  const tests: Array<{ id: string; title: string; description: string | null; _count: { questions: number; results: number } }> = await adminGetPlacementTests();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Placement tests</h1>
        <Button asChild>
          <Link href="/admin/placement-tests/create">Create test</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tests.map((test) => (
          <Card key={test.id}>
            <CardHeader>
              <CardTitle>{test.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>{test.description}</p>
              <p>Questions: {test._count.questions}</p>
              <p>Assignments: {test._count.results}</p>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/admin/placement-tests/${test.id}/edit`}>Edit</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/admin/placement-tests/assign">Assign tests</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin/placement-tests/results">View results</Link>
        </Button>
      </div>
    </div>
  );
}
