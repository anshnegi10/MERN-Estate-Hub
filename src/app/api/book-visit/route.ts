import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Support both name and fullName depending on the client form
    const fullName = data.fullName || data.name;
    const { phone, email, propertyTitle, date, time, message } = data;

    if (!fullName || !phone || !email || !date || !time) {
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 });
    }

    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;
    const receiver = process.env.BOOKING_RECEIVER_EMAIL || user;

    if (!user || !pass) {
      console.error("Missing Gmail SMTP credentials in environment variables.");
      return NextResponse.json({ error: 'Email service is not configured correctly on the server.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: `"EstateHub Booking" <${user}>`,
      to: receiver,
      subject: 'New Booking / Appointment Request',
      text: `
New Booking / Appointment Request

Full Name: ${fullName}
Email: ${email}
Phone Number: ${phone}
Property Name: ${propertyTitle || 'N/A'}
Requested Date/Time: ${date} at ${time}
Message: ${message || 'No message provided.'}

Submitted From: EstateHub
      `,
    };

    await transporter.sendMail(mailOptions);
    
    return NextResponse.json({ message: 'Visit request sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send visit request' }, { status: 500 });
  }
}
