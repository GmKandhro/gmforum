import { ConnectDb } from "@/dbConnect";
import { ApiError,ApiResponse } from "@/lib/responses";
import { postModel } from "@/models/postModel";
import { connect } from "http2";


export async function GET(req:Request) {
    await ConnectDb()
    try {
        const posts =await postModel.find()
        if(!posts){
            return Response.json(new ApiError(400,"there is no posts"))
        };
        return Response.json(new ApiResponse(200,"posts fetched successfully",posts))
    } catch (error) {
        return Response.json(new ApiError(500,"Error while getting post"))
    }
}