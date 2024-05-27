import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser, userSchema } from "./userModel";
import { IPost } from "./postModel";
import { postSchema } from "@/schemas/postSchema";

export interface ICommands extends Document {
   content:string;
   user: Schema.Types.ObjectId;
   post:Schema.Types.ObjectId;
}

export const commandSchema: Schema<ICommands> = new Schema({
    content: {
        type: String,
        required: true,
    },
    post: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    user: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

export const commandModel = (mongoose.models.Command as mongoose.Model<ICommands>) ||  mongoose.model<ICommands>('Command', commandSchema);

