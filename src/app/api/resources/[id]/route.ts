import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.resource.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse("Error", { status: 500 });
  }
}
