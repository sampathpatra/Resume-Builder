import nodemailer from "nodemailer";
import { BrevoClient } from "@getbrevo/brevo";

/**
 * Creates and returns an SMTP transporter if SMTP environment variables are present.
 */
const createSmtpTransporter = () => {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465 || process.env.SMTP_SECURE === "true",
        auth: {
            user,
            pass,
        },
    });
};

/**
 * Creates and returns a Brevo API client if BREVO_API_KEY is present.
 */
const createBrevoClient = () => {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) return null;
    return new BrevoClient({ apiKey });
};

/**
 * Sends a transactional email using configured SMTP or Brevo API.
 */
export const sendEmail = async ({ to, subject, htmlContent, textContent }) => {
    const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@devresume.ai";
    const senderName = process.env.BREVO_SENDER_NAME || process.env.SMTP_SENDER_NAME || "DevResume.ai";

    const smtpTransporter = createSmtpTransporter();
    const brevoClient = createBrevoClient();

    // 1. Try standard SMTP if configured
    if (smtpTransporter) {
        try {
            const info = await smtpTransporter.sendMail({
                from: `"${senderName}" <${senderEmail}>`,
                to,
                subject,
                text: textContent,
                html: htmlContent,
            });
            console.log("[Email Service] Sent via SMTP. Message ID:", info.messageId);
            return info;
        } catch (smtpError) {
            console.error("[Email Service] SMTP Error:", smtpError.message);
            // If Brevo is not configured, rethrow
            if (!brevoClient) {
                throw smtpError;
            }
            console.log("[Email Service] Falling back to Brevo API...");
        }
    }

    // 2. Try Brevo API if available
    if (brevoClient) {
        try {
            const response = await brevoClient.transactionalEmails.sendTransacEmail({
                sender: {
                    name: senderName,
                    email: senderEmail,
                },
                to: [{ email: to }],
                subject,
                htmlContent,
                textContent,
            });
            console.log("[Email Service] Sent via Brevo API.");
            return response;
        } catch (brevoError) {
            console.error("[Email Service] Brevo API Error:", brevoError.message);
            throw brevoError;
        }
    }

    // 3. No email provider configured
    throw new Error(
        "Missing email configuration. Please configure SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS) or Brevo (BREVO_API_KEY, BREVO_SENDER_EMAIL) in server/.env."
    );
};
