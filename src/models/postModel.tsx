import mongoose, { Schema, Document, Model } from "mongoose";
import { Icomments, commentSchema } from "./commentsModel";
import { ILikes, likesSchema } from "./likesModel";
import { IUser, userSchema } from "./userModel";

export interface IPost extends Document {
    title: string;
    content: string;
    author:string;
    likes: Number;
    comments: Schema.Types.ObjectId
}

const postSchema: Schema<IPost> = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
   
    author: { type:String,required:true },
    likes: {
        type:Number,
        default:0
    },
    comments:[{ type: Schema.Types.ObjectId, ref: "Comment" }]
},{timestamps:true});


export const postModel = (mongoose.models.Post as mongoose.Model<IPost>) ||  mongoose.model<IPost>('Post', postSchema);
