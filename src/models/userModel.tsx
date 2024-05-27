import mongoose, { Schema, Document, Model } from "mongoose";
import { IPost } from "./postModel";
import { postSchema } from "@/schemas/postSchema";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    posts: Schema.Types.ObjectId;
}

export const userSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>('User', userSchema);

export { UserModel};


