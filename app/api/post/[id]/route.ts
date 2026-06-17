import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Replace with your actual prisma import path

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req:NextRequest,{params}:RouteParams) {
  const {id} = await params;
  try {
   const post =  await prisma.post.findUnique({where:{
      id:parseInt(id)
    },
    include:{
      author:true
    }})
  return NextResponse.json({success:true,msg:"Post Fetched",post:post},{status:200})
  } catch (error) {
    
  }
}
export async function PUT(req:NextRequest, {params}:RouteParams) {
  const {id} = await params;
  const {title,content} = await req.json();
  try {
    await prisma.post.update({where:{
      id: parseInt(id)
    },data:{
      title,
      content
    }},
  )
  return NextResponse.json({success:true,msg:"Updated"})
  } catch (error) {
    console.log("Error:",error)
    return NextResponse.json({success:false,msg:"Not Updated"})
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const { id } = await params;
   console.log(id)
  try {
    // Pass 'id' directly as a string
    await prisma.post.delete({
      where: {
        id: parseInt(id), 
      },
    });

    return NextResponse.json({ success: true, msg: "Post deleted" });
  } catch (error) {
    console.error("Prisma Delete Error:", error);
    return NextResponse.json(
      { success: false, msg: 'Post not deleted' },
      { status: 500 } // Changed 401 (Unauthorized) to 500 (Server Error) since it's a try/catch block failure
    );
  }
}