import { ConnectDb } from "@/dbConnect";
import { ApiError, ApiResponse } from "@/lib/responses";
import { postModel } from "@/models/postModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserModel } from "@/models/userModel";
import { cookies } from "next/headers";
import { any } from "zod";

interface Params {
    postId: string;
}

export async function PATCH(req: Request, { params }: { params: Params }) {
    await ConnectDb()
    try {
        const { title, content } = await req.json()
        const cookieStore = cookies()
        const token = cookieStore.get('token')?.value.toString() as string

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
        const user = await UserModel.findById(decodedToken?.id)
        const post = await postModel.findById(params.postId)
        if (user?.username !== post?.author) {
            return Response.json(new ApiError(400, "Dot allowed to update"))
        }

        const updatedPost = await postModel.findByIdAndUpdate(
            post?._id || params.postId,
            {
                title,
                content
            },
            { new: true } // Returns the updated document
        );
    await user?.save()
        return Response.json(new ApiResponse(200, "post updated successfull"))


    } catch (error) {
        return Response.json(new ApiError(500, "Error while updating post"))
    }
}