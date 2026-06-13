
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

    // Determine the recipient (fallback to master admin)
    const recipient = data.to || "hitechsoftware03@gmail.com";
    const submissionType = data.type || "New Submission";
    const senderName = data.fullName || data.name || "HITECH System";

    // Build specialized email for onboarding
    const isOnboarding = data.type === "Worker Onboarding";
    
    const subject = isOnboarding 
      ? `Welcome to HITECH Systems, ${senderName}`
      : `[${submissionType}] From: ${senderName}`;

    const htmlContent = isOnboarding ? `
      <div style="font-family: sans-serif; padding: 32px; color: #1a1a1a; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 24px;">
        <h2 style="color: #00A3FF; margin-bottom: 8px; font-size: 24px;">Welcome to the Team.</h2>
        <p style="font-size: 11px; color: #6b7280; margin-top: 0; text-transform: uppercase; letter-spacing: 0.2em;">Institutional Onboarding Protocol</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        
        <p style="font-size: 16px; line-height: 1.6; color: #374151;">
          Hello ${data.fullName},<br /><br />
          You have been successfully onboarded as a <b>${data.role}</b> in the HITECH Intelligent Software Systems platform. Your identity has been provisioned with the following access credentials:
        </p>

        <div style="background-color: #f9fafb; padding: 24px; border-radius: 16px; border: 1px solid #f3f4f6; margin: 24px 0;">
          <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; color: #111827;">Clearance Details:</p>
          <p style="margin: 8px 0; font-size: 14px;"><b style="color: #6b7280; width: 100px; display: inline-block;">Email:</b> <span style="color: #111827;">${data.email}</span></p>
          <p style="margin: 8px 0; font-size: 14px;"><b style="color: #6b7280; width: 100px; display: inline-block;">Password:</b> <code style="background: #eee; padding: 2px 6px; border-radius: 4px; color: #00A3FF; font-weight: bold;">${data.password}</code></p>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #374151; margin-bottom: 32px;">
          You can access your assigned portals by verifying your clearance at the link below:
        </p>

        <div style="text-align: center;">
          <a href="https://hitech.systems/login" style="background-color: #00A3FF; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Verify Clearance & Login</a>
        </div>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
        <p style="font-size: 10px; color: #9ca3af; text-align: center; font-style: italic;">This is an automated institutional transmission. Secure end-to-end encryption active.</p>
      </div>
    ` : `
      <div style="font-family: sans-serif; padding: 24px; color: #1a1a1a; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 16px;">
        <h2 style="color: #00A3FF; margin-bottom: 4px; font-size: 20px;">HITECH Neural Core</h2>
        <p style="font-size: 11px; color: #6b7280; margin-top: 0; text-transform: uppercase; letter-spacing: 0.1em;">Automated System Transmission</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #f3f4f6;">
          <p style="margin-bottom: 16px; font-weight: bold; color: #374151;">Submission Details:</p>
          ${Object.entries(data)
            .filter(([key]) => !['status', 'createdAt', 'type', 'to'].includes(key))
            .map(([key, value]) => {
              if (typeof value === 'object') return '';
              const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
              return `<p style="margin: 10px 0; font-size: 14px;"><b style="color: #6b7280; width: 120px; display: inline-block;">${formattedKey}:</b> <span style="color: #111827;">${value}</span></p>`;
            })
            .join("")}
        </div>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="font-size: 10px; color: #9ca3af; text-align: center; font-style: italic;">This is a secure transmission originating from the HITECH Platform API.</p>
      </div>
    `;

    await transporter.sendMail({
      from: '"HITECH Systems" <no-reply@hitech.systems>',
      to: recipient,
      replyTo: data.email || "hitechsoftware03@gmail.com",
      subject: subject,
      html: htmlContent,
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
