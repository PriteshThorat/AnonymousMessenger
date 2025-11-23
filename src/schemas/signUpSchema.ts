import { exportTraceState } from "next/dist/trace"
import { z } from "zod"

export const usernameValidation = z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(20, "Username must be at least 20 characters")
    .regex(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/igm, "Username must not contain special characters")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.email({message: "Invalid email address"}),
    password: z.string().min(6, "Password must be at least 6 characters")
})