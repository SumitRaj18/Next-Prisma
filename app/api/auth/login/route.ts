import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken'
import { strict } from "assert"
import { cookies } from "next/headers"
import { use } from "react"

export async function POST(req:Request) {
    const {email,password} = await req.json()
    try {
        const user = await prisma.user.findUnique({where:{email}})
        if (!user) {
           return NextResponse.json({success:false,msg:"User not exists"})
        }
        const match = await prisma.user.findFirst({
            where:{
                email:email,
                password:password
            }
        })
        if (!match) {
            return NextResponse.json({success:false,msg:'Password is wrong'})
        }
        const token = jwt.sign({id:user.id},"Sumit8076",{expiresIn:'1h'})
        console.log(token)
       const response = NextResponse.json({ success: true, msg: "Login Success",user:user })
           response.cookies.set("token", token) 
   return response;

    } catch (error) {
        console.log(error)
    }
}