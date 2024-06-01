import { ConnectDb } from "@/dbConnect";
import { ApiError, ApiResponse } from "@/lib/responses";
import { postModel } from "@/models/postModel";
import { UserModel } from "@/models/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import mongoose from "mongoose";


export async function GET(req: Request) {
    await ConnectDb()
    try {
        console.log("start")
        const cookieStore = cookies()
        const token = cookieStore.get('token')?.value.toString() as string
        if (!token) {
            return Response.json(new ApiError(400, "user does not exists"))
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    
        const user = await UserModel.findById(decodedToken?.id)
        const getPosts = await UserModel.aggregate([
            {
                $match: {
                    _id: user?._id
                }
            },
            {
                "$unwind": "$posts"
            },
            {
                "$group": {
                    "_id": "$posts"
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "_id",
                    as: "PostsDetails"
                }
            },
            {
                $unwind: "$PostsDetails"
            },
            {
                $replaceRoot: {
                    newRoot: "$PostsDetails"
                }
            }


        ])

        return Response.json(new ApiResponse(200, "user posts fetched successfull", getPosts))
    } catch (error) {
        return Response.json(new ApiError(500, "Error while getting posts"))
    }
}