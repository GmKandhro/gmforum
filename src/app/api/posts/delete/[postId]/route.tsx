import { ConnectDb } from "@/dbConnect";
import { ApiError, ApiResponse } from "@/lib/responses";
import { postModel } from "@/models/postModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserModel } from "@/models/userModel";
import { cookies } from "next/headers";

interface Params {
    postId: string;
}

export async function DELETE(req: Request, { params }: { params: Params }) {
    await ConnectDb()
    try {
        const cookieStore = cookies()
        const token = cookieStore.get('token')?.value.toString() as string
        if(!token){
            return Response.json(new ApiError(400, "User not authrice"))
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
        const userId = decodedToken?.id
        const user = await UserModel.findById(userId)
        const post = await postModel.findById(params.postId)
        if(params.postId != post?._id){
            return Response.json(new ApiError(400, "Post already deleted"))
        }
        const update = await UserModel.updateOne(
            { _id: userId },
            { $pull: { posts:post._id } }
          );
        if (user?.username !== post?.author) {
            return Response.json(new ApiError(400, "Dot allowed to delete"))
        }

        await postModel.findByIdAndDelete(post?._id)
       
        return Response.json(new ApiResponse(200, "post deleted successfull"))

    } catch (error) {
        return Response.json(new ApiError(500, "Error while deleting post"))
    }
}