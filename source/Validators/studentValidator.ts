import {z } from "zod";

export const studentSchema = z.object({
    accessCode: z.string().regex(/^\d{4}$/, "The code must have exactly 4 numbers")
});