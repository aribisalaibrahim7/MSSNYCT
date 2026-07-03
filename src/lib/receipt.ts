import nodemailer from "nodemailer";

export function buildReceiptHtml(payload: {
  name: string;
  email: string;
  eventTitle: string;
  amountPaid: number | null;
  paymentReference?: string | null;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  createdAt?: string | Date;
}) {
  const amount = payload.amountPaid != null ? `₦${Number(payload.amountPaid).toLocaleString()}` : "—";
  const method = payload.paymentMethod ? payload.paymentMethod.toUpperCase() : "FREE";
  const status = payload.paymentStatus || "PAID";
  const createdAt = payload.createdAt ? new Date(payload.createdAt).toLocaleString() : new Date().toLocaleString();

  return `
    <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 18px; background: #fff; color: #111827;">
      <div style="background: linear-gradient(90deg, #2563eb, #7c3aed); color: white; padding: 24px; border-radius: 16px 16px 0 0;">
        <h1 style="margin:0; font-size: 24px;">MSSN Yabatech Payment Receipt</h1>
        <p style="margin: 8px 0 0; opacity: 0.9;">Official registration receipt</p>
      </div>
      <div style="padding: 24px;">
        <p style="margin: 0 0 8px;">Salaam <strong>${payload.name}</strong>,</p>
        <p style="margin: 0 0 16px;">Your registration for <strong>${payload.eventTitle}</strong> has been recorded successfully.</p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
          <p style="margin: 4px 0;"><strong>Receipt for:</strong> ${payload.email}</p>
          <p style="margin: 4px 0;"><strong>Payment Method:</strong> ${method}</p>
          <p style="margin: 4px 0;"><strong>Status:</strong> ${status}</p>
          <p style="margin: 4px 0;"><strong>Amount:</strong> ${amount}</p>
          <p style="margin: 4px 0;"><strong>Reference:</strong> ${payload.paymentReference || "N/A"}</p>
          <p style="margin: 4px 0;"><strong>Date:</strong> ${createdAt}</p>
        </div>
        <p style="font-size: 13px; color: #64748b;">Thank you for supporting MSSN Yabatech.</p>
      </div>
    </div>
  `;
}

export async function sendReceiptEmail(payload: {
  to: string;
  name: string;
  email?: string;
  eventTitle: string;
  amountPaid: number | null;
  paymentReference?: string | null;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  createdAt?: string | Date;
}) {
  const html = buildReceiptHtml({
    ...payload,
    email: payload.email || payload.to,
  });

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return { status: "skipped", html };
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"MSSN Hub" <${process.env.SMTP_USER}>`,
    to: payload.to,
    subject: `Receipt for ${payload.eventTitle}`,
    html,
  });

  return { status: "sent", html };
}
