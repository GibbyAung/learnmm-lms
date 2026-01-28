import * as z from "zod";

export const CourseLevels = ["Beginner", "Intermediate", "Advanced"] as const;
export const CourseStatus = ["Published", "Draft", "Archived"] as const;
export const Categories = [
  "Development",
  "Business",
  "Design",
  "Marketing",
  "IT and Software",
  "Personal Development",
  "Health and Fitness",
  "Music",
  "Photography",
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters." })
    .max(100, { message: "Bug title must be at most 100 characters." }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters." })
    .max(200, { message: "Description must be at most 200 characters." }),
  fileKey: z.string().min(1, { message: "File is required." }),
  price: z.coerce.number<number>().min(1),
  duration: z.coerce.number<number>().min(1).max(500),

  level: z.enum(CourseLevels),
  category: z.enum(Categories, { message: "Category is required." }),
  smallDescription: z
    .string()
    .min(3, { message: "Description must be at least 3 characters." })
    .max(200, { message: "Description must be at most 200 characters." }),

  slug: z.string().min(1, { message: "Slug is required." }),

  status: z.enum(CourseStatus, {
    message: "Status is required.",
  }),
});

export type CourseScehmaType = z.infer<typeof courseSchema>;
