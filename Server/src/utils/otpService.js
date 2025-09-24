import nodemailer from "nodemailer";
import axios from "axios";
import twilio from "twilio";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendEmail = async (email, message) => {
  const mailOptions = {
    from: `"BattelGame" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your BattelGame OTP Code",
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="background-color: #111827; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">BattelGame</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #111827;">Your One-Time Password (OTP)</h2>
          <p style="font-size: 16px; color: #4b5563;">
            Use the following OTP to verify your identity and continue using BattelGame.
          </p>
          <div style="font-size: 32px; font-weight: bold; color: #10b981; margin: 20px 0; text-align: center;">
            ${message}
          </div>
          <p style="font-size: 14px; color: #6b7280;">
            This OTP is valid for only a short time. Do not share it with anyone.
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            If you did not request this code, please ignore this email or contact support.
          </p>
        </div>
      </div>
    </div>
  `,
  };

  const result = await transporter.sendMail(mailOptions);
  console.log("Email sent to", email);
  return result;
};

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const sendSMS = async (phoneNumber, message) => {
  try {
    const result = await client.messages.create({
      body: `Your OTP is ${message}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log("✅ SMS sent via Twilio to", phoneNumber);
    return result;
  } catch (error) {
    console.error("❌ Twilio SMS error:", error);
    throw new Error("Failed to send SMS via Twilio");
  }
};

export { generateOTP, sendEmail, sendSMS };
