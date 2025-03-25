import { z } from "zod";

export const tuitionSchema = z.object({
    amount: z.number({
        required_error: "is required",
        invalid_type_error: "must be a number"
    }),
    paymentDate: z.enum(["FIVE", "TENTH", "FIFTEENTH", "TWENTIETH"]),
    parentId: z.number({
        required_error: "is required",
    }),
    paymentStatus: z.enum(["PENDING", "PAID", "CANCELLED", "REFUNDED"])
})