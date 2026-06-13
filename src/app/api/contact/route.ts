
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

    await transporter.sendMail({
      from: '"HITECH Software" <no-reply@hitech.systems>',
      to: "hitechsoftware03@gmail.com",
      replyTo: data.email,
      subject: `New HITECH Submission: ${data.fullName || "Website Visitor"}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #00A3FF; margin-bottom: 5px;">HITECH Neural Core</h2>
          <p style="font-size: 12px; color: #999; margin-top: 0;">Automated System Notification</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px;">
            ${Object.entries(data)
              .filter(([key]) => key !== 'status' && key !== 'createdAt')
              .map(([key, value]) => {
                if (typeof value === 'object') return '';
                return `<p style="margin: 8px 0;"><b style="color: #666; text-transform: capitalize;">${key.replace(/([A-Z])/g, ' $1')}:</b> ${value}</p>`;
              })
              .join("")}
          </div>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 10px; color: #aaa; text-align: center;">This is a secure transmission from the HITECH Platform.</p>
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
