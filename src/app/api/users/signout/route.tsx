import { ConnectDb } from "@/dbConnect";
import { ApiError, ApiResponse } from "@/lib/responses";
import { IUser, UserModel } from "@/models/userModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { cookies } from 'next/headers'


export async function GET(req:Request) {
    await ConnectDb()
    try {
        cookies().set('token', "")
        return Response.json(new ApiResponse(200,"user Logout successfull"))
    } catch (error) {
       return  Response.json(new ApiError(500,"Error while signout user"))
    }
}