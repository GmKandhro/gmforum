import mongoose ,{Document,Model,Schema} from "mongoose"

import { IPost } from "./postModel"
import { IUser, userSchema } from "./userModel"
import { postSchema } from "@/schemas/postSchema";

export interface ILikes extends Document{
    post:Schema.Types.ObjectId;
    likedBy: Schema.Types.ObjectId;
}

export const likesSchema :Schema<ILikes>= new Schema({
    post: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

export const likesModel = (mongoose.models.Like as mongoose.Model<ILikes>) ||  mongoose.model<ILikes>('Like', likesSchema);