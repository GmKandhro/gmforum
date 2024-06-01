import { ConnectDb } from "@/dbConnect";
import { ApiError, ApiResponse } from "@/lib/responses";
import { likesModel } from "@/models/likesModel";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken"
import { postModel } from "@/models/postModel";

interface Params {
    postId: string;
}

export async function POST(req: Request, { params }: { params: Params }) {
    try {
        const cookiesStore = cookies()
        const token = cookiesStore.get("token")?.value.toString() as string
        if(!token){
             return Response.json(new ApiResponse(400,"User does not exists"))
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET!)
        const userId = (decoded as JwtPayload).id;
        const postId = params.postId
       const post = await postModel.findById(postId)
        
       const existsLikes = await likesModel.findOne({post:postId,likedBy:userId})
       if(existsLikes){
            await likesModel.findByIdAndDelete(existsLikes._id)
            await postModel.findByIdAndUpdate(postId, { $inc: { likes: -1 } }, { new: true });
            return Response.json(new ApiResponse(200,"Like removed"))
       }else{
            await likesModel.create({
                post:postId,
                likedBy:userId
            })
            await postModel.findByIdAndUpdate(postId, { $inc: { likes: 1 } }, { new: true });
       }
        return Response.json(new ApiResponse(200,"post liked successfull"))
    } catch (error) {
        return Response.json(new ApiResponse(500,"Error while Liking post"))
    }
}


