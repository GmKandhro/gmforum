import { ConnectDb } from "@/dbConnect";
import { ApiError, ApiResponse } from "@/lib/responses";
import { postModel } from "@/models/postModel";
import { UserModel } from "@/models/userModel";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken"
import mongoose from "mongoose";

export async function POST(req:Request) {
    await ConnectDb()
 try {
    const {title,content} =await req.json()
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value.toString() as string
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET!) as JwtPayload
    const userID = decodedToken?.id
  

    const user = await UserModel.findById(userID)

    const post = new postModel({
        title,
        content,
        author:user?.username,
        likes:0,
        commands:[]
    })
    await post.save()

     user?.posts.push(post._id)

    await user?.save()

    return Response.json(new ApiResponse(200,"Post created successfull"))
 } catch (error) {
    return Response.json(new ApiError(500,"Error while creating Post",error))
 }   
}