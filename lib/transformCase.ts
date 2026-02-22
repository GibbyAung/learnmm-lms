const LEVEL_TO_FORM = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
} as const;

const LEVEL_TO_DB = {
  Beginner: "BEGINNER",
  Intermediate: "INTERMEDIATE",
  Advanced: "ADVANCED",
} as const;

const STATUS_TO_FORM = {
  PUBLISHED: "Published",
  DRAFT: "Draft",
  ARCHIVED: "Archived",
} as const;

const STATUS_TO_DB = {
  Published: "PUBLISHED",
  Draft: "DRAFT",
  Archived: "ARCHIVED",
} as const;

type DbLevel = keyof typeof LEVEL_TO_FORM;
type FormLevel = keyof typeof LEVEL_TO_DB;

type DbStatus = keyof typeof STATUS_TO_FORM;
type FormStatus = keyof typeof STATUS_TO_DB;

export function prepareFormDefaults<
  T extends { level: DbLevel; status: DbStatus; category: string },
>(course: T) {
  return {
    ...course,
    level: LEVEL_TO_FORM[course.level],
    status: STATUS_TO_FORM[course.status],
    category: course.category, // keep as-is unless your form expects a union too
  };
}

export function prepareDbData<
  T extends { level: FormLevel; status: FormStatus; category: string },
>(formData: T) {
  return {
    ...formData,
    level: LEVEL_TO_DB[formData.level],
    status: STATUS_TO_DB[formData.status],
  };
}
