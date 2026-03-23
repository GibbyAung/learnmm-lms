import { studentGetPlacementResult } from "@/app/data/placement/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { TakePlacementTestForm } from "../_components/TakePlacementTestForm";

export default async function StudentPlacementResultDetailPage({
  params,
}: {
  params: Promise<{ resultId: string }>;
}) {
  const { resultId } = await params;
  const result = (await studentGetPlacementResult(resultId)) as {
    id: string;
    status: string;
    score: number | null;
    correctCount: number;
    totalQuestions: number;
    test: {
      title: string;
      questions: Array<{
        id: string;
        question: string;
        imageUrl: string | null;
        type: "MULTIPLE_CHOICE" | "TRUE_FALSE";
        options: unknown;
        correctAnswer: string;
      }>;
    };
    answers: Array<{ questionId: string; answer: string; isCorrect: boolean }>;
  } | null;

  if (!result) {
    notFound();
  }

  if (result.status === "ASSIGNED") {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{result.test.title}</h1>
        <TakePlacementTestForm
          resultId={result.id}
          questions={result.test.questions.map((question) => ({
            id: question.id,
            question: question.question,
            imageUrl: question.imageUrl,
            type: question.type,
            options: question.options,
          }))}
        />
      </div>
    );
  }

  const answerMap = new Map(
    result.answers.map((answer) => [answer.questionId, answer]),
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{result.test.title} - Result</h1>
      <Card>
        <CardHeader>
          <CardTitle>Score: {result.score}%</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Correct: {result.correctCount} / {result.totalQuestions}
          </p>
        </CardContent>
      </Card>

      {result.test.questions.map((question, index) => {
        const answer = answerMap.get(question.id);

        return (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle>
                {index + 1}. {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              {question.imageUrl && (
                <div className="mb-2">
                  <img
                    src={question.imageUrl}
                    alt="Question image"
                    className="max-w-full h-auto rounded-md border"
                  />
                </div>
              )}
              <p>Your answer: {answer?.answer ?? "-"}</p>
              <p>Correct answer: {question.correctAnswer}</p>
              <p>{answer?.isCorrect ? "Correct" : "Incorrect"}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
