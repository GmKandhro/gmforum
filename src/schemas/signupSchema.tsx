import z from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const signupSchema = z.object({
    username: z.string().min(4, { message: "Username should be at least 4 characters long." }).max(50, { message: "Username should not exceed 50 characters." }),
    email: z.string().email({ message: "Invalid email format." }).regex(emailRegex, { message: "Invalid email format." }),
    password: z.string().min(6, { message: "Password should be at least 6 characters long." }),
});
