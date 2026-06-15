import { getGalleryImages } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const images = await getGalleryImages();
    return NextResponse.json(images);
  } catch (error) {
    return new NextResponse("Error fetching gallery", { status: 500 });
  }
}
