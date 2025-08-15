const crypto = require("crypto");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

class VerificationService {
  constructor() {
    this.smsService = process.env.SMS_SERVICE || "mock";
    this.emailService = this.setupEmailService();
  }

  setupEmailService() {
    return {
      sendMail: async (options) => {
        if (
          process.env.NODE_ENV === "development" ||
          process.env.NODE_ENV === "production"
        ) {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });
          return transporter.sendMail(options);
        }

        if (process.env.NODE_ENV === "testing") {
          console.log("📧 Mock Email Sent:", {
            to: options.to,
            subject: options.subject,
            text: options.text,
          });
          return { messageId: "mock-" + Date.now() };
        }

        throw new Error(`Unknown NODE_ENV: ${process.env.NODE_ENV}`);
      },
    };
  }

  generatePhoneOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  generateEmailCode() {
    return crypto.randomBytes(32).toString("hex");
  }

  async sendPhoneOTP(phone, otp) {
    try {
      if (this.smsService === "mock") {
        console.log(`📱 Mock SMS sent to ${phone}: Your OTP is ${otp}`);
        return { success: true, messageId: "mock-sms-" + Date.now(), otp };
      }
      return { success: true, messageId: "sms-sent", otp };
    } catch (error) {
      console.error("SMS sending error:", error);
      throw new Error("Failed to send SMS OTP");
    }
  }

  async sendVerificationEmail(email, verificationCode, userName) {
    try {
      const verificationUrl = `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/verify-email?code=${verificationCode}`;

      const mailOptions = {
        from: process.env.SMTP_USER || "noreply@asrpharma.com",
        to: email,
        subject: "Verify Your Email - ASR Pharma",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">ASR Pharma</h1>
            </div>
            <div style="padding: 20px; background: #f9f9f9;">
              <h2 style="color: #333;">Hello ${userName},</h2>
              <p>Thank you for signing up with ASR Pharma! To complete your registration, please verify your email address.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
              <p>This verification link will expire in 24 hours.</p>
              <p>If you didn't create an account with ASR Pharma, please ignore this email.</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px;">
                This is an automated email. Please do not reply to this message.
              </p>
            </div>
          </div>
        `,
      };

      const result = await this.emailService.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("Email sending error:", error);
      throw new Error("Failed to send verification email");
    }
  }

  verifyPhoneOTP(storedOTP, storedExpiry, inputOTP) {
    if (!storedOTP || !storedExpiry) {
      return { valid: false, message: "No OTP found" };
    }
    if (new Date() > new Date(storedExpiry)) {
      return { valid: false, message: "OTP has expired" };
    }
    if (storedOTP !== inputOTP) {
      return { valid: false, message: "Invalid OTP" };
    }
    return { valid: true, message: "OTP verified successfully" };
  }

  verifyEmailCode(storedCode, storedExpiry, inputCode) {
    if (!storedCode || !storedExpiry) {
      return { valid: false, message: "No verification code found" };
    }
    if (new Date() > new Date(storedExpiry)) {
      return { valid: false, message: "Verification code has expired" };
    }
    if (storedCode !== inputCode) {
      return { valid: false, message: "Invalid verification code" };
    }
    return { valid: true, message: "Email verified successfully" };
  }

  calculateExpiry(type = "phone") {
    const now = new Date();
    if (type === "phone") {
      return new Date(now.getTime() + 15 * 60 * 1000);
    }
    return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }
}

module.exports = new VerificationService();
