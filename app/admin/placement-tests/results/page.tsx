import { adminGetPlacementResults } from "@/app/data/placement/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PlacementResultsPage() {
  const results: Array<{ id: string; status: string; score: number | null; correctCount: number; totalQuestions: number; student: { name: string; email: string }; test: { title: string } }> = await adminGetPlacementResults();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Placement test results</h1>

      <div className="grid gap-4 md:grid-cols-2">
        {results.map((result) => (
          <Card key={result.id}>
            <CardHeader>
              <CardTitle>{result.test.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Student: {result.student.name} ({result.student.email})</p>
              <p>Status: {result.status}</p>
              <p>Score: {result.score ?? "Not submitted"}</p>
              <p>
                Correct answers: {result.correctCount}/{result.totalQuestions}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
