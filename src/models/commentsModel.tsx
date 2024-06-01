import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser, userSchema } from "./userModel";
import { IPost } from "./postModel";
import { postSchema } from "@/schemas/postSchema";

export interface Icomments extends Document {
   content:string;
   user: Schema.Types.ObjectId;
   post:Schema.Types.ObjectId;
}

export const commentSchema: Schema<Icomments> = new Schema({
    content: {
        type: String,
        required: true,
    },
    post: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    user: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

export const commentModel = (mongoose.models.Comment as mongoose.Model<Icomments>) ||  mongoose.model<Icomments>('Comment', commentSchema);

