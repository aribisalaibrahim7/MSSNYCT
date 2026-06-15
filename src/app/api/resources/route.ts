import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCloudinaryResources } from "@/lib/cloudinary";

export async function GET() {
  try {
    const dbResources = await prisma.resource.findMany({
      orderBy: { createdAt: "desc" },
    });

    const cloudResources = await getCloudinaryResources();

    // Combine database resources with direct Cloudinary folder resources
    const allResources = [...dbResources, ...cloudResources].sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(allResources);
  } catch (error) {
    return new NextResponse("Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, category, type, fileUrl, authorId } = await req.json();
    const resource = await prisma.resource.create({
      data: { title, category, type, fileUrl, authorId },
    });
    return NextResponse.json(resource);
  } catch (error) {
    return new NextResponse("Error", { status: 500 });
  }
}
