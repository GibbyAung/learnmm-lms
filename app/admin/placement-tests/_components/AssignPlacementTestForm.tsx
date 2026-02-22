"use client";

import { assignPlacementTest } from "@/app/data/placement/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";

export function AssignPlacementTestForm({
  tests,
  students,
}: {
  tests: { id: string; title: string }[];
  students: { id: string; name: string; email: string }[];
}) {
  const [testId, setTestId] = useState(tests[0]?.id ?? "");
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    const response = await assignPlacementTest({ testId, studentId });
    setLoading(false);

    if (response.status === "error") {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
  };

  return (
    <div className="space-y-4 max-w-xl">
      <div className="space-y-2">
        <Label>Placement test</Label>
        <select
          className="w-full rounded-md border p-2"
          value={testId}
          onChange={(event) => setTestId(event.target.value)}
        >
          {tests.map((test) => (
            <option key={test.id} value={test.id}>
              {test.title}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label>Student</Label>
        <select
          className="w-full rounded-md border p-2"
          value={studentId}
          onChange={(event) => setStudentId(event.target.value)}
        >
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} ({student.email})
            </option>
          ))}
        </select>
      </div>

      <Button type="button" onClick={submit} disabled={loading || !testId || !studentId}>
        {loading ? "Assigning..." : "Assign test"}
      </Button>
    </div>
  );
}
