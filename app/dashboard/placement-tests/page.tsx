import { studentGetAssignedPlacementTests } from "@/app/data/placement/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function StudentPlacementTestsPage() {
  const results: Array<{ id: string; status: string; score: number | null; test: { title: string; description: string | null } }> = await studentGetAssignedPlacementTests();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My placement tests</h1>

      <div className="grid gap-4 md:grid-cols-2">
        {results.map((result) => (
          <Card key={result.id}>
            <CardHeader>
              <CardTitle>{result.test.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>{result.test.description}</p>
              <p>Status: {result.status}</p>
              <p>Score: {result.score ?? "Pending"}</p>
              <Button asChild>
                <Link href={`/dashboard/placement-tests/${result.id}`}>
                  {result.status === "ASSIGNED" ? "Take test" : "View result"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
