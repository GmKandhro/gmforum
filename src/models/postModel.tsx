import mongoose, { Schema, Document, Model } from "mongoose";
import { ICommands, commandSchema } from "./commandsModel";
import { ILikes, likesSchema } from "./likesModel";
import { IUser, userSchema } from "./userModel";

export interface IPost extends Document {
    title: string;
    content: string;
    thumbnail:string;
    author:Schema.Types.ObjectId;
    likes: Schema.Types.ObjectId;
    commands: Schema.Types.ObjectId
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
    thumbnail: {
        type:String,
        required:true
    },
    author: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
    commands:[{ type: Schema.Types.ObjectId, ref: "Command" }]
},{timestamps:true});


export const postModel = (mongoose.models.Post as mongoose.Model<IUser>) ||  mongoose.model<IPost>('Post', postSchema);
