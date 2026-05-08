import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/repositories/user.repo';
import { connectDB } from '@/database/connection';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        await connectDB();
        const user = await findUserByEmail(email);
        if (!user) {
            return NextResponse.json({ error: "Email not found" }, { status: 404 });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save OTP and 5-min expiry to user
        user.resetOtp = otp;
        user.resetOtpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
        await user.save();

        // Setup Nodemailer
        const gmailUser = process.env.GMAIL_USER;
        const gmailPass = process.env.GMAIL_APP_PASSWORD;

        if (!gmailUser || !gmailPass) {
            console.error("Missing Gmail SMTP credentials for forgot password");
            return NextResponse.json({ error: 'Email service is not configured correctly.' }, { status: 500 });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: gmailUser,
                pass: gmailPass,
            },
        });

        const mailOptions = {
            from: `"EstateHub Security" <${gmailUser}>`,
            to: email,
            subject: 'Your OTP Code - EstateHub',
            text: `
Hello,

You recently requested to reset your password for your EstateHub account.
Your OTP is: ${otp}

This OTP is valid for 5 minutes.

If you did not request a password reset, please ignore this email.

Thanks,
The EstateHub Team
            `,
            html: `
<div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
    <h2 style="color: #2d6a5e;">EstateHub Password Reset</h2>
    <p>Hello,</p>
    <p>You recently requested to reset your password for your EstateHub account. Please use the following OTP to verify your request:</p>
    <div style="text-align: center; margin: 30px 0;">
        <span style="background-color: #2d6a5e; color: white; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 24px; letter-spacing: 4px;">${otp}</span>
    </div>
    <p style="font-size: 14px; color: #666;">This OTP is valid for 5 minutes.</p>
    <p style="font-size: 12px; color: #999; margin-top: 40px;">If you did not request a password reset, please ignore this email.</p>
</div>
            `
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: "OTP sent to your email" }, { status: 200 });
    } catch (error: any) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
