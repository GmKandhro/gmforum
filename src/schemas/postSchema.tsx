import z from "zod";


export const postSchema = z.object({
    title: z.string().min(10, { message: "Title should be at least 10 characters long." }).max(100, { message: "Title should not exceed 100 characters." }),
    content: z.string().min(50, { message: "content should be at least 10 characters long." }).max(800, { message: "content should not exceed 800 characters." }),
   
});
