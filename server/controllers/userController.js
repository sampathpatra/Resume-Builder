import User from "../models/User.js";
import Resume from "../models/Resume.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../configs/email.js";

const generateToken = (userId) => {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
    return token;
};

// POST: /api/users/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword
        });

        const token = generateToken(newUser._id);
        newUser.password = undefined;

        return res.status(201).json({
            message: "User created successfully",
            user: newUser,
            token
        });

    } catch (error) {
        return res.status(400).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// POST: /api/users/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(400).json({
                message: "Invalid Email or Password"
            });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user._id);
        user.password = undefined;

        return res.status(200).json({
            message: "User logged in successfully",
            user,
            token
        });

    } catch (error) {
        return res.status(400).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// POST: /api/users/forgot-password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        // Mitigate user enumeration: return success even if user not found
        if (!user) {
            return res.status(200).json({
                message: "If an account exists with this email, a reset link has been sent."
            });
        }

        // Generate a cryptographically secure random token (32 bytes = 64 hex characters)
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Store only the SHA-256 hashed token in MongoDB
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

        await user.save();

        const baseUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");
        const resetURL = `${baseUrl}/reset-password/${resetToken}`;

        console.log("\n=======================================================");
        console.log("[DevResume.ai] Password Reset Requested for:", user.email);
        console.log("[DevResume.ai] Reset URL:", resetURL);
        console.log("=======================================================\n");

        try {
            await sendEmail({
                to: user.email,
                subject: "DevResume.ai - Password Reset Request",
                textContent: `You requested a password reset for your DevResume.ai account. Open this link to create a new password: ${resetURL}. This link expires in 15 minutes. If you did not request this, you can safely ignore this email.`,
                htmlContent: `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background-color: #FAFAF9; border-radius: 16px; color: #0F172A;">
                        <div style="text-align: center; margin-bottom: 28px;">
                            <h1 style="font-size: 24px; font-weight: 800; color: #0F172A; margin: 0;">DevResume<span style="color: #6D28D9;">.ai</span></h1>
                            <p style="font-size: 13px; color: #64748B; margin-top: 4px;">Developer Career & Resume Platform</p>
                        </div>
                        <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 28px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                            <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 0; margin-bottom: 12px;">Reset Your Password</h2>
                            <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 20px;">
                                We received a request to reset the password associated with your account (<strong>${user.email}</strong>). Click the button below to choose a new password:
                            </p>
                            <div style="text-align: center; margin: 28px 0;">
                                <a href="${resetURL}" style="display: inline-block; background-color: #6D28D9; color: #FFFFFF; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 10px; box-shadow: 0 4px 12px rgba(109, 40, 217, 0.25);">
                                    Reset Password
                                </a>
                            </div>
                            <p style="font-size: 12px; line-height: 1.5; color: #64748B; margin-bottom: 8px;">
                                &#9201; This link is only valid for <strong>15 minutes</strong> and can only be used once.
                            </p>
                            <p style="font-size: 12px; line-height: 1.5; color: #64748B; margin-bottom: 0;">
                                If you did not request a password reset, you can safely ignore this email. Your account remains secure.
                            </p>
                        </div>
                        <div style="text-align: center; margin-top: 24px; font-size: 11px; color: #94A3B8;">
                            &copy; ${new Date().getFullYear()} DevResume.ai. Engineered for developers.
                        </div>
                    </div>
                `
            });
        } catch (emailError) {
            // Remove the unused token if email delivery fails
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            throw emailError;
        }

        return res.status(200).json({
            message: "If an account exists with this email, a reset link has been sent."
        });

    } catch (error) {
        console.error("Forgot password error:", error.message);

        let clientMessage = "Unable to process password reset request. Please try again.";
        if (error.message?.includes("unrecognised IP address") || error.body?.message?.includes("unrecognised IP address")) {
            clientMessage = "Email delivery failed: Server IP address is not authorized in Brevo settings.";
        } else if (error.message?.includes("Missing email configuration")) {
            clientMessage = "Email service is not configured. Please configure SMTP or Brevo in server/.env.";
        } else if (error.message) {
            clientMessage = `Email delivery failed: ${error.message}`;
        }

        return res.status(500).json({
            message: clientMessage
        });
    }
};

// GET: /api/users/verify-reset-token/:token
export const verifyResetToken = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({
                valid: false,
                message: "Reset token is required"
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                valid: false,
                message: "Password reset link is invalid or has expired"
            });
        }

        return res.status(200).json({
            valid: true,
            email: user.email
        });

    } catch (error) {
        console.error("Verify reset token error:", error.message);
        return res.status(500).json({
            valid: false,
            message: "Unable to verify reset token"
        });
    }
};

// POST: /api/users/reset-password/:token
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "New password is required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        // Hash the token received from the reset link
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find the user with a valid, unexpired reset token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Password reset link is invalid or has expired"
            });
        }

        // Hash and update the new password using bcrypt
        user.password = await bcrypt.hash(password, 10);

        // Invalidate token after single use
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.status(200).json({
            message: "Password has been reset successfully. You can now log in."
        });

    } catch (error) {
        console.error("Reset password error:", error.message);

        return res.status(500).json({
            message: "Unable to reset password. Please try again."
        });
    }
};

// GET: /api/users/data
export const getUserById = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.password = undefined;

        return res.status(200).json({ user });

    } catch (error) {
        return res.status(400).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// GET: /api/users/resume
export const getUserResumes = async (req, res) => {
    try {
        const userId = req.userId;

        const resumes = await Resume.find({ userId });

        return res.status(200).json({ resumes });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};
