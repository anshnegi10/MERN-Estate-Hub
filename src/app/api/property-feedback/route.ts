import { NextResponse } from 'next/server';
import { connectDB } from '@/database/connection';
import Feedback from '@/database/models/Feedback';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        
        const { propertyId, propertyName, issueType, message, name, email, anonymous, imageUrl } = body;

        if (!propertyId || !propertyName || !issueType || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        
        if (message.length > 1000) {
            return NextResponse.json({ error: "Message too long" }, { status: 400 });
        }

        const newFeedback = new Feedback({
            propertyId,
            propertyName,
            issueType,
            message,
            name: anonymous ? 'Anonymous' : (name || 'Anonymous'),
            email: anonymous ? '' : email,
            anonymous,
            imageUrl,
            status: 'pending'
        });

        await newFeedback.save();

        const gmailUser = process.env.GMAIL_USER;
        const gmailPass = process.env.GMAIL_APP_PASSWORD;

        if (gmailUser && gmailPass) {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: { user: gmailUser, pass: gmailPass },
            });

            await transporter.sendMail({
                from: `"EstateHub Alerts" <${gmailUser}>`,
                to: 'estatehub33@gmail.com',
                subject: `New Safety Feedback Report: ${propertyName}`,
                html: `
                    <h2>New Safety Feedback Submitted</h2>
                    <p><strong>Property:</strong> ${propertyName} (ID: ${propertyId})</p>
                    <p><strong>Issue Type:</strong> ${issueType}</p>
                    <p><strong>Reporter:</strong> ${anonymous ? 'Anonymous' : (name || 'Unknown')} ${email && !anonymous ? '(' + email + ')' : ''}</p>
                    <p><strong>Message:</strong></p>
                    <blockquote style="background:#f4f4f4;padding:10px;border-left:4px solid #ccc;">
                        ${message}
                    </blockquote>
                    ${imageUrl ? `<p><strong>Attached Image:</strong> <a href="${imageUrl}">${imageUrl}</a></p>` : ''}
                    <p><em>This feedback is pending review in the admin dashboard.</em></p>
                `
            });
        }

        return NextResponse.json({ success: true, message: "Feedback submitted successfully" }, { status: 201 });
    } catch (error: any) {
        console.error('Feedback submission error:', error);
        return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const propertyId = searchParams.get('propertyId');

        if (!propertyId) {
            return NextResponse.json({ error: "Property ID required" }, { status: 400 });
        }

        await connectDB();
        
        // Fetch all feedback to calculate insights
        const feedbacks = await Feedback.find({ propertyId }).sort({ createdAt: -1 });

        return NextResponse.json({ feedbacks }, { status: 200 });
    } catch (error: any) {
        console.error('Fetch feedback error:', error);
        return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
    }
}
