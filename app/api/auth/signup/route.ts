import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req:Request) {
    const {Name,email,password} = await req.json();
    try {
        const existingUser = await prisma.user.findUnique({where:{email:email}})
        if (existingUser) {
          return  NextResponse.json({msg:"User already exists"})
        }
        const user = await prisma.user.create(
            {
                data:{Name,email,password}
            }
        )
       return NextResponse.json({success:true,msg:"User created"})
    } catch (error) {
        console.log(error)
        
    } 
}