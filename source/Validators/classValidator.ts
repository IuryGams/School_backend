import {z} from "zod";

export const classSchema = z.object({
    name: z.string().min(3, "Class name must be at least 3 characters long"),
    subjectId: z.number().int("Subject ID must be an integer"),
    teacherId: z.number().int("Teacher ID must be an integer"),
});