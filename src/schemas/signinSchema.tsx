import z from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const signinSchema = z.object({
    identifer: z.string().email({ message: "Invalid email format." }).regex(emailRegex, { message: "Invalid email format." }),
    password: z.string().min(6, { message: "Password should be at least 6 characters long." }),
});
