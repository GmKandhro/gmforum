import { ConnectDb } from "@/dbConnect";
import { ApiError, ApiResponse } from "@/lib/responses";
import { likesModel } from "@/models/likesModel";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken"
import { postModel } from "@/models/postModel";
import { commentModel } from "@/models/commentsModel";
import mongoose from "mongoose";


interface Params {
    postId: string
}

export async function GET(req: Request, { params }: { params: Params }) {
    await ConnectDb()
    try {
        const cookieStore = cookies()
        const token = cookieStore.get("token")?.value.toString() as string
        if (!token) {
            return Response.json(new ApiResponse(400, "User does not exists"))
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
        const userId = decodedToken.id

        const postId = params.postId

        const comments = await postModel.aggregate(
            [
                {
                  $match: {
                    _id: new mongoose.Types.ObjectId(postId)
                  }
                },
                {
                  $unwind: "$comments"
                },
                {
                  $group: {
                    _id: "$comments",
                  }
                },
                {
                  $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "_id",
                    as: "comments"
                  }
                },
                {
                  $unwind: "$comments"
                },
                {
                  $replaceRoot: {
                    newRoot: "$comments"
                  }
                },
                {
                  $unwind: "$user"
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                  }
                },
                {
                  $project: {
                    content:1,
                    post:1,
                    user:{ $arrayElemAt: ["$user", 0]}
                  }
                }
               
              ]
        )

        return Response.json(new ApiResponse(200,"Comments fetched successfull",comments))
    } catch (error) {
        return Response.json(new ApiError(500, "Error while getting comments"))
    }
}