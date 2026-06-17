import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
const JWT_SECRET = new TextEncoder().encode("Sumit8076");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function POST(req: NextRequest) {

    try {
        let token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
        }
        const decoded = await jwtVerify(token, JWT_SECRET);
        
        const rawId = decoded.payload.id; 
        
        if (rawId === undefined || rawId === null) {
            return NextResponse.json({ msg: "User ID not found in token" }, { status: 401 });
        }

        const authorId = typeof rawId === "number" ? rawId : parseInt(rawId as string, 10);

        if (isNaN(authorId)) {
            return NextResponse.json({ msg: "Invalid User ID format in token" }, { status: 401 });
        }
        const formData = await req.formData();
        const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const file = formData.get("image") as File | null;


    let imageUrl = null;

     if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "devspace_posts" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      }) as any;

      imageUrl = uploadResult.secure_url; // This is your hosted image string link
    }

        const post = await prisma.post.create({
            data: {
                title: title,
                content: content,
                image:imageUrl,
                authorId: authorId 
            }
        });
        
        return NextResponse.json({ msg: "Post created", post: post }, { status: 201 });

    } catch (error: any) {
        console.error("Prisma Error:", error);
        return NextResponse.json({ msg: "Failed to create post", error: error.message }, { status: 500 });
    }
}

export async function GET(req:NextRequest) {

    try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
            return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
        }
    const decoded = await jwtVerify(token,JWT_SECRET)
    const rawId = decoded.payload.id;
 
    const userId = typeof rawId == 'number' ? rawId : parseInt(rawId as string)

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('skip') || '5')
    const skip = (page-1) * limit;
        const post = await prisma.post.findMany({
            skip:skip,
            take:limit,
            orderBy: {createdAt:'desc'}
            ,where:{
        authorId:userId
        },
            include:
            {author:true}
        })
        const total = await prisma.post.count();
        return NextResponse.json({success:true,post:post,total:total})
    } catch (error) {
        return NextResponse.json({msg:"error"})
    }
}



