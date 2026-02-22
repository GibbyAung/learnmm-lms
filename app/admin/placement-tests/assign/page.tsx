import { adminGetPlacementTests, adminGetStudents } from "@/app/data/placement/queries";
import { AssignPlacementTestForm } from "../_components/AssignPlacementTestForm";

export default async function AssignPlacementTestsPage() {
  const [tests, students]: [Array<{ id: string; title: string }>, Array<{ id: string; name: string; email: string }>] = await Promise.all([
    adminGetPlacementTests(),
    adminGetStudents(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Assign placement tests</h1>
      <AssignPlacementTestForm
        tests={tests.map((test) => ({ id: test.id, title: test.title }))}
        students={students.map((student) => ({
          id: student.id,
          name: student.name,
          email: student.email,
        }))}
      />
    </div>
  );
}
