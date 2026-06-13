
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER || "no-reply@hitech.systems",
        pass: process.env.SMTP_PASS || "",
      },
    });

    // Determine the sender name for the subject
    const senderName = data.fullName || data.name || "Website Visitor";
    const submissionType = data.type || "New Submission";

    await transporter.sendMail({
      from: '"HITECH Software" <no-reply@hitech.systems>',
      to: "hitechsoftware03@gmail.com",
      replyTo: data.email,
      subject: `[${submissionType}] From: ${senderName}`,
      html: `
        <div style="font-family: sans-serif; padding: 24px; color: #1a1a1a; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 16px;">
          <h2 style="color: #00A3FF; margin-bottom: 4px; font-size: 20px;">HITECH Neural Core</h2>
          <p style="font-size: 11px; color: #6b7280; margin-top: 0; text-transform: uppercase; letter-spacing: 0.1em;">Automated System Transmission</p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #f3f4f6;">
            <p style="margin-bottom: 16px; font-weight: bold; color: #374151;">Submission Details:</p>
            ${Object.entries(data)
              .filter(([key]) => !['status', 'createdAt', 'type'].includes(key))
              .map(([key, value]) => {
                if (typeof value === 'object') return '';
                // Format keys from camelCase to Title Case
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                return `<p style="margin: 10px 0; font-size: 14px;"><b style="color: #6b7280; width: 120px; display: inline-block;">${formattedKey}:</b> <span style="color: #111827;">${value}</span></p>`;
              })
              .join("")}
          </div>

          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="font-size: 10px; color: #9ca3af; text-align: center; font-style: italic;">This is a secure transmission originating from the HITECH Platform API.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("HITECH Mail Bridge Error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
