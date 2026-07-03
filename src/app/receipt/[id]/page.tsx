import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ReceiptClient } from "./ReceiptClient";

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const registration = await prisma.eventRegistration.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!registration) {
    return notFound();
  }

  return <ReceiptClient registration={registration} />;
}
