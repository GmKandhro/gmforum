import { ConnectDb } from "@/dbConnect";
import { ApiError, ApiResponse } from "@/lib/responses";
import { likesModel } from "@/models/likesModel";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken"
import { postModel } from "@/models/postModel";
import { commentModel } from "@/models/commentsModel";


interface Params{
    postId: string
}

export async function POST(req:Request, { params }: { params: Params }) {
    await ConnectDb()
    try {
        const cookieStore = cookies()
        const token = cookieStore.get("token")?.value.toString() as string
        if(!token){
            return Response.json(new ApiResponse(400,"User does not exists"))
       }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
        const postId = params.postId
        const post = await postModel.findById(postId)
        const  userId = decodedToken.id
        const {content} =await req.json()
        
        const comment = await commentModel.create({
            content,
            post:postId,
            user:userId
        })

        post?.comments.push(comment._id)
        await post?.save()
        return Response.json(new ApiResponse(200,"comment added successfull",comment))
        
    } catch (error) {
        return Response.json(new ApiError(500,"Error while adding comment"))
    }
}