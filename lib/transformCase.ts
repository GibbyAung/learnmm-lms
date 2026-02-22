// lib/transform-course.ts

/**
 * Prepare course data for form defaultValues
 */
export function prepareFormDefaults<
  T extends { level: string; status: string; category: string },
>(course: T) {
  return {
    ...course,
    level: (course.level.charAt(0) +
      course.level.slice(1).toLowerCase()) as string,
    status: (course.status.charAt(0) +
      course.status.slice(1).toLowerCase()) as string,
    // category: (course.category.charAt(0) +
    //   course.category.slice(1).toLowerCase()) as string,
    category: course.category as string,
  };
}

/**
 * Prepare form data for database save
 * Transforms form format (Capitalized) to DB format (UPPERCASE)
 */
export function prepareDbData<
  T extends { level: string; status: string; category: string },
>(formData: T) {
  return {
    ...formData,
    level: formData.level.toUpperCase() as string,
    status: formData.status.toUpperCase() as string,
  };
}
