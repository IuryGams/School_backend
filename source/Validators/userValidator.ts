import { z } from "zod";

export const userSchema = z.object({
    name: z.string({
        required_error: "is required",
        invalid_type_error: "must be a string"
    }).min(3, {
        message: "must have at least 3 letters"
    }),
    lastName: z.string({
        required_error: "is required",
        invalid_type_error: "must be a string"
    }).min(3, {
        message: "must have at least 3 letters"
    }),
    email: z.string({
        required_error: "is required",
    }).email({
        message: "entered is not valid. Please enter a correct email."
    }),
    password: z.string({
        required_error: "is required",
    }).min(8, "Must contain at least 8 character(s)").regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
            message: "must contain at least one uppercase letter, one lowercase letter, one number and one special character."
        }
    ),
    role: z.enum(["ADMIN", "COORDINATOR", "TEACHER", "STUDENT", "PARENT"])
})