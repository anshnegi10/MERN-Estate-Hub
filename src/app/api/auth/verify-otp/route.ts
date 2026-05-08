import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/repositories/user.repo';
import { connectDB } from '@/database/connection';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
        }

        await connectDB();
        const user = await findUserByEmail(email);
        if (!user) {
            return NextResponse.json({ error: "Email not found" }, { status: 404 });
        }

        if (user.resetOtp !== otp) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }

        if (user.resetOtpExpiry && new Date() > user.resetOtpExpiry) {
            return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
        }

        // OTP is valid. Clear it so it can't be reused.
        user.resetOtp = undefined;
        user.resetOtpExpiry = undefined;
        await user.save();

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not configured");
        }

        // Generate the reset password token (valid for 15 mins)
        const token = jwt.sign({ userId: user._id, email: user.email }, secret, { expiresIn: '15m' });

        // Setup Nodemailer
        const gmailUser = process.env.GMAIL_USER;
        const gmailPass = process.env.GMAIL_APP_PASSWORD;

        if (!gmailUser || !gmailPass) {
            console.error("Missing Gmail SMTP credentials for verify OTP");
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

        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const resetLink = `${baseUrl}/reset-password?token=${token}`;

        const mailOptions = {
            from: `"EstateHub Security" <${gmailUser}>`,
            to: email,
            subject: 'Reset Your Password - EstateHub',
            text: `
Hello,

Your OTP has been verified successfully.
Click this link to reset your password:

${resetLink}

If you did not request a password reset, please ignore this email.
This link will expire in 15 minutes.

Thanks,
The EstateHub Team
            `,
            html: `
<div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
    <h2 style="color: #2d6a5e;">EstateHub Password Reset</h2>
    <p>Hello,</p>
    <p>Your OTP has been verified successfully. Click the button below to reset your password.</p>
    <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #2d6a5e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
    </div>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #666;"><a href="${resetLink}">${resetLink}</a></p>
    <p style="font-size: 12px; color: #999; margin-top: 40px;">If you did not request a password reset, please ignore this email. This link will expire in 15 minutes.</p>
</div>
            `
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: "Password reset link sent to your email" }, { status: 200 });
    } catch (error: any) {
        console.error('Verify OTP error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
