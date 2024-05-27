import { ConnectDb } from "@/dbConnect";
import { ApiError, ApiResponse } from "@/lib/responses";
import { IUser, UserModel } from "@/models/userModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { cookies } from 'next/headers'

// mongodb+srv://gmkandhro88:gmk@cluster0.iwdji0j.mongodb.net/forumweb  mongoDb atlas


export async function POST(request:Request, NextResponse:NextResponse) {
    await ConnectDb()
    try {
        const {email,password} = await request.json()

        const user = await UserModel.findOne({email})
        if(!user) return Response.json(new ApiError(400,"User does not exists"))

        const hashPassword =await bcrypt.compare(password,user.password)
        if(!hashPassword) return Response.json(new ApiResponse(400,"Password is incorrect"))

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET!)

        cookies().set('token', token, { secure: true,httpOnly:true })

       return Response.json(new ApiResponse(200,"user sign in successfull"))
    } catch (error) {
        return Response.json(new ApiError(500,"Error while signin user"))
    }
}