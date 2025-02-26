import {z } from "zod";

export const AuthSchema = z.object({
    email: z.string({
        required_error:"is required."
    }).email({
        message: "entered is not valid. Please enter a correct email."
    }),
    password: z.string({
        required_error: "is required."
    })
});