import { ConnectDb } from "@/dbConnect";
import { ApiError, ApiResponse } from "@/lib/responses";
import {  UserModel } from "@/models/userModel";
import bcrypt from "bcrypt"
import mongoose from "mongoose";
import { postModel } from "@/models/postModel";

// mongodb+srv://gmkandhro88:gmk@cluster0.iwdji0j.mongodb.net/forumweb  mongoDb atlas


export async function POST(request:Request) {
    await ConnectDb()
    try {

        
        const {username,email,password} = await request.json()

        const userExists = await UserModel.findOne({
            $or:[
                {username},
                {email}
            ]
        })
        if(userExists) {
            return Response.json(new ApiError(400,"user already exists Change username or email"))
        }

        const hashedPassword =await bcrypt.hash(password,10)

        const user = await  UserModel.create({
            username,
            email,
            password:hashedPassword,
            posts:[]
        })
          
        return Response.json(new ApiError(200,"user signup successfull"))
    } catch (error) {
        return Response.json(new ApiError(500,"Error while signup user"))
    }
}