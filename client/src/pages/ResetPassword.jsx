import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../configs/api";
import toast from "react-hot-toast";
import {
    FileText,
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    ArrowRight,
    Loader2,
    ShieldCheck,
    AlertCircle,
    CheckCircle2
} from "lucide-react";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Token verification state: "verifying" | "valid" | "invalid"
    const [tokenStatus, setTokenStatus] = useState("verifying");
    const [userEmail, setUserEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setTokenStatus("invalid");
            setErrorMessage("Password reset token is missing from the link.");
            return;
        }

        const verifyToken = async () => {
            try {
                const { data } = await api.get(`/api/users/verify-reset-token/${token}`);
                if (data.valid) {
                    setTokenStatus("valid");
                    if (data.email) {
                        setUserEmail(data.email);
                    }
                } else {
                    setTokenStatus("invalid");
                    setErrorMessage(data.message || "This password reset link is invalid or has expired.");
                }
            } catch (error) {
                setTokenStatus("invalid");
                setErrorMessage(
                    error?.response?.data?.message ||
                    "This password reset link is invalid or has expired. Please request a new one."
                );
            }
        };

        verifyToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters long.");
        }

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match.");
        }

        setIsLoading(true);

        try {
            const { data } = await api.post(
                `/api/users/reset-password/${token}`,
                { password }
            );

            toast.success(data.message || "Password reset successfully! You can now log in.");
            navigate("/login");
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Password reset failed. Your link may have expired."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAF9] text-slate-900 selection:bg-violet-600/15 selection:text-violet-900 flex flex-col relative overflow-hidden antialiased">
            {/* Subtle light background grid matching homepage */}
            <div className="absolute inset-0 bg-light-grid opacity-60 pointer-events-none" />

            {/* Subtle, elegant ambient floating gradient lights */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
                <div className="absolute -top-16 -left-16 sm:-top-24 sm:-left-24 w-72 sm:w-[480px] h-72 sm:h-[480px] bg-violet-200/30 rounded-full blur-[100px] sm:blur-[140px] animate-ambient-1" />
                <div className="absolute top-6 -right-16 sm:top-12 sm:-right-24 w-64 sm:w-[440px] h-64 sm:h-[440px] bg-orange-100/35 rounded-full blur-[90px] sm:blur-[130px] animate-ambient-2" />
                <div className="absolute -bottom-16 left-6 sm:left-16 w-64 sm:w-[400px] h-64 sm:h-[400px] bg-teal-100/25 rounded-full blur-[90px] sm:blur-[130px] animate-ambient-3" />
            </div>

            {/* Header Lockup */}
            <header className="relative z-20 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-700 shadow-xs group-hover:bg-violet-100 group-hover:border-violet-300 transition-all duration-200">
                            <FileText className="w-5 h-5 text-violet-700 group-hover:scale-105 transition-transform" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-violet-800 transition-colors">
                            DevResume<span className="text-violet-600">.ai</span>
                        </span>
                    </Link>

                    <Link
                        to="/login"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 transition-all shadow-2xs"
                    >
                        <ArrowLeft className="w-4 h-4 text-slate-400" />
                        <span>Back to Login</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
                <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-200/60 p-6 sm:p-9">

                    {/* State 1: Verifying Token */}
                    {tokenStatus === "verifying" && (
                        <div className="py-12 text-center space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-200 text-violet-700 flex items-center justify-center mx-auto shadow-xs">
                                <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Verifying Reset Link</h2>
                            <p className="text-xs text-slate-500 max-w-xs mx-auto">
                                Checking token validity and security status...
                            </p>
                        </div>
                    )}

                    {/* State 2: Invalid or Expired Token */}
                    {tokenStatus === "invalid" && (
                        <div className="py-6 text-center space-y-5">
                            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Link Invalid or Expired</h2>
                                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                                    {errorMessage || "This password reset link is invalid, has expired, or has already been used."}
                                </p>
                            </div>
                            <div className="pt-2">
                                <Link
                                    to="/login"
                                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-violet-700 hover:bg-violet-800 shadow-md shadow-violet-700/20 border border-violet-600 transition-all cursor-pointer"
                                >
                                    <span>Return to Login &amp; Request New Link</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* State 3: Valid Token - Form */}
                    {tokenStatus === "valid" && (
                        <>
                            <div className="mb-7">
                                <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-200 text-violet-700 flex items-center justify-center mb-5 shadow-xs">
                                    <Lock className="w-6 h-6" />
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Create New Password
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                                    {userEmail
                                        ? `Resetting password for ${userEmail}.`
                                        : "Enter a new secure password for your account."}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* New Password */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        New Password
                                    </label>
                                    <div className="relative rounded-xl border border-slate-200 bg-slate-50/70 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-2 focus-within:ring-violet-500/15 transition-all">
                                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••••••"
                                            required
                                            minLength={6}
                                            autoComplete="new-password"
                                            className="w-full pl-10 pr-10 py-2.5 bg-transparent border-0 outline-hidden text-sm text-slate-900 placeholder-slate-400 font-normal"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 focus:outline-hidden cursor-pointer"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-1">Must be at least 6 characters long.</p>
                                </div>

                                {/* Confirm New Password */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Confirm New Password
                                    </label>
                                    <div className="relative rounded-xl border border-slate-200 bg-slate-50/70 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-2 focus-within:ring-violet-500/15 transition-all">
                                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••••••"
                                            required
                                            minLength={6}
                                            autoComplete="new-password"
                                            className="w-full pl-10 pr-10 py-2.5 bg-transparent border-0 outline-hidden text-sm text-slate-900 placeholder-slate-400 font-normal"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 focus:outline-hidden cursor-pointer"
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {confirmPassword && password !== confirmPassword && (
                                        <p className="text-[11px] text-rose-500 mt-1">Passwords do not match.</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading || password.length < 6 || password !== confirmPassword}
                                    className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-violet-700 hover:bg-violet-800 shadow-md shadow-violet-700/20 border border-violet-600 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                                            <span>Updating Password...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Reset Password</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    )}

                    {/* Security Badge */}
                    <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                        <span>Pass-through 256-bit SSL encryption &amp; bcrypt hashing</span>
                    </div>

                </div>
            </main>

            {/* Bottom Minimal Footer */}
            <footer className="py-6 px-4 border-t border-slate-200/60 text-center text-xs text-slate-500 relative z-10">
                <p>&copy; {new Date().getFullYear()} DevResume.ai. Engineered for developers.</p>
            </footer>
        </div>
    );
}
