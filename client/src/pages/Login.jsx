import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../configs/api";
import { useDispatch } from "react-redux";
import { login } from "../app/features/authSlice";
import toast from "react-hot-toast";
import {
    FileText,
    ArrowRight,
    ArrowLeft,
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    Check,
    ShieldCheck,
    Loader2
} from "lucide-react";

export default function Login({ mode }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine mode from prop, pathname (/signup), or query param (?state=signup)
    const query = new URLSearchParams(location.search);
    const urlState = query.get("state");
    const isSignup =
        mode === "signup" ||
        location.pathname.toLowerCase().includes("signup") ||
        urlState === "signup" ||
        urlState === "register";

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isForgotLoading, setIsForgotLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleOpenSignup = () => {
        navigate("/signup");
    };

    const handleOpenLogin = () => {
        navigate("/login");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client validation
        if (isSignup && !formData.name.trim()) {
            return toast.error("Please enter your full name");
        }
        if (!formData.email.trim()) {
            return toast.error("Please enter your email address");
        }
        if (!formData.password || formData.password.length < 6) {
            return toast.error("Password must be at least 6 characters long");
        }

        setIsLoading(true);
        try {
            const endpoint = isSignup ? "signup" : "login";
            const payload = isSignup
                ? { name: formData.name.trim(), email: formData.email.trim(), password: formData.password }
                : { email: formData.email.trim(), password: formData.password };

            const { data } = await api.post(`/api/users/${endpoint}`, payload);

            dispatch(login(data));
            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            toast.success(data.message || (isSignup ? "Account created successfully!" : "Welcome back!"));
            navigate("/app");
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "Authentication failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

 const handleForgotPassword = async () => {
    if (!formData.email.trim()) {
        return toast.error("Please enter your email address first.");
    }

    setIsForgotLoading(true);

    try {
        const { data } = await api.post("/api/users/forgot-password", {
            email: formData.email.trim()
        });

        toast.success(
            data.message ||
            "If an account exists, password reset instructions have been sent."
        );
    } catch (error) {
        toast.error(
            error?.response?.data?.message ||
            "Unable to send password reset email. Please try again."
        );
    } finally {
        setIsForgotLoading(false);
    }
};

    return (
        <div className="min-h-screen bg-[#FAFAF9] text-slate-900 selection:bg-violet-600/15 selection:text-violet-900 flex flex-col relative overflow-hidden antialiased">
            {/* Subtle light background grid matching homepage */}
            <div className="absolute inset-0 bg-light-grid opacity-60 pointer-events-none" />

            {/* Subtle, elegant ambient floating gradient lights matching homepage */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
                {/* Soft Violet Shape - Top Left Edge */}
                <div className="absolute -top-16 -left-16 sm:-top-24 sm:-left-24 w-72 sm:w-[480px] h-72 sm:h-[480px] bg-violet-200/30 rounded-full blur-[100px] sm:blur-[140px] animate-ambient-1" />
                {/* Muted Coral / Warm Peach Shape - Top Right Edge */}
                <div className="absolute top-6 -right-16 sm:top-12 sm:-right-24 w-64 sm:w-[440px] h-64 sm:h-[440px] bg-orange-100/35 rounded-full blur-[90px] sm:blur-[130px] animate-ambient-2" />
                {/* Refined Teal / Mint Glow - Bottom Left Edge */}
                <div className="absolute -bottom-16 left-6 sm:left-16 w-64 sm:w-[400px] h-64 sm:h-[400px] bg-teal-100/25 rounded-full blur-[90px] sm:blur-[130px] animate-ambient-3" />
            </div>

            {/* Header Lockup */}
            <header className="relative z-20 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
                    {/* Brand / Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-700 shadow-xs group-hover:bg-violet-100 group-hover:border-violet-300 transition-all duration-200">
                            <FileText className="w-5 h-5 text-violet-700 group-hover:scale-105 transition-transform" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-violet-800 transition-colors">
                            DevResume<span className="text-violet-600">.ai</span>
                        </span>
                    </Link>

                    {/* Navigation Actions */}
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        {!isSignup ? (
                            <button
                                type="button"
                                onClick={handleOpenSignup}
                                className="text-xs sm:text-sm font-semibold text-violet-700 hover:text-violet-800 px-3.5 py-2 rounded-xl bg-violet-50 hover:bg-violet-100/80 border border-violet-200 shadow-2xs transition-all cursor-pointer"
                            >
                                Create New Account
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleOpenLogin}
                                className="text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 shadow-2xs transition-all cursor-pointer"
                            >
                                Sign In
                            </button>
                        )}

                        <Link
                            to="/"
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 transition-all shadow-2xs"
                        >
                            <ArrowLeft className="w-4 h-4 text-slate-400" />
                            <span className="hidden sm:inline">Back to Homepage</span>
                            <span className="sm:hidden">Home</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
                <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                    
                    {/* Left Column: Developer Showcase & Value Props (Desktop) */}
                    <div className="hidden lg:flex flex-col lg:col-span-6 xl:col-span-7">
                        {/* Tech Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs mb-6 w-fit">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-xs font-semibold text-slate-700 font-mono tracking-tight">
                                DEVRESUME WORKSPACE
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight">
                            Engineered for Developers. <br />
                            <span className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 bg-clip-text text-transparent">
                                Resumes Built Like Production Code.
                            </span>
                        </h1>

                        <p className="text-base text-slate-600 mb-8 leading-relaxed max-w-lg">
                            Access your saved resumes, optimize bullet points with multi-model AI, and export verified ATS-compatible single-page PDFs.
                        </p>

                        {/* Interactive Developer Code / Score Mockup */}
                        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-lg shadow-slate-200/50 overflow-hidden mb-6 max-w-lg font-mono">
                            {/* Window Title Bar */}
                            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/90 border-b border-slate-200/80 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
                                    <span className="ml-2 text-[11px] text-slate-600 font-mono">career.config.ts</span>
                                </div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/80 text-[10px] font-medium font-mono">
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                                    ATS Score: 98/100
                                </span>
                            </div>

                            {/* Code Body */}
                            <div className="p-4 bg-slate-50/40 text-xs text-slate-700 space-y-1">
                                <p><span className="text-violet-700 font-semibold">export const</span> <span className="text-slate-900 font-semibold">workspace</span> = &#123;</p>
                                <p className="pl-4"><span className="text-indigo-900">aiModels</span>: [<span className="text-teal-700">"Groq LLaMA 3.3"</span>, <span className="text-teal-700">"Gemini Flash"</span>],</p>
                                <p className="pl-4"><span className="text-indigo-900">formatting</span>: <span className="text-teal-700">"ATS Structured Standard"</span>,</p>
                                <p className="pl-4"><span className="text-indigo-900">pdfCompile</span>: <span className="text-teal-700">"Zero-Config 1-Page"</span></p>
                                <p>&#125;;</p>
                            </div>
                        </div>

                        {/* Value Bullet Points */}
                        <div className="space-y-2.5 text-xs text-slate-600 font-medium max-w-lg">
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                                <span>Multi-model AI tailoring tailored specifically for tech resumes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                                <span>Real-time ATS keyword verification and score calculation</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                                <span>Privacy-first architecture: You retain 100% control of your profile</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Authentication Form Card */}
                    <div className="w-full lg:col-span-6 xl:col-span-5">
                        <div className="w-full max-w-md mx-auto bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-200/60 p-6 sm:p-9 relative z-10">
                            
                            {/* Segmented Switcher Pill */}
                            <div className="flex p-1 bg-slate-100/90 border border-slate-200/80 rounded-xl mb-6">
                                <button
                                    type="button"
                                    onClick={handleOpenLogin}
                                    className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer ${
                                        !isSignup
                                            ? "bg-white text-slate-900 shadow-xs border border-slate-200/70"
                                            : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    Sign In
                                </button>
                                <button
                                    type="button"
                                    onClick={handleOpenSignup}
                                    className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer ${
                                        isSignup
                                            ? "bg-white text-slate-900 shadow-xs border border-slate-200/70"
                                            : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    Create New Account
                                </button>
                            </div>

                            {/* Title & Description */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                    {!isSignup ? "Welcome back" : "Create developer account"}
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                                    {!isSignup
                                        ? "Sign in to access your resumes and continue editing."
                                        : "Get started with AI-powered resume building in seconds."}
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {isSignup && (
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            Full Name
                                        </label>
                                        <div className="relative rounded-xl border border-slate-200 bg-slate-50/70 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-2 focus-within:ring-violet-500/15 transition-all">
                                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Alex Rivera"
                                                required={isSignup}
                                                autoComplete="name"
                                                className="w-full pl-10 pr-3.5 py-2.5 bg-transparent border-0 outline-hidden text-sm text-slate-900 placeholder-slate-400 font-normal"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Email Address
                                    </label>
                                    <div className="relative rounded-xl border border-slate-200 bg-slate-50/70 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-2 focus-within:ring-violet-500/15 transition-all">
                                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="alex@developer.io"
                                            required
                                            autoComplete="email"
                                            className="w-full pl-10 pr-3.5 py-2.5 bg-transparent border-0 outline-hidden text-sm text-slate-900 placeholder-slate-400 font-normal"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-semibold text-slate-700">
                                            Password
                                        </label>
                                        {!isSignup && (
                                            <button
                                                type="button"
                                                onClick={handleForgotPassword}
                                                disabled={isForgotLoading}
                                                className="text-xs font-medium text-violet-700 hover:text-violet-800 transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                                            >
                                                {isForgotLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                                                <span>{isForgotLoading ? "Sending reset link..." : "Forgot password?"}</span>
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative rounded-xl border border-slate-200 bg-slate-50/70 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-2 focus-within:ring-violet-500/15 transition-all">
                                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••••••"
                                            required
                                            autoComplete={!isSignup ? "current-password" : "new-password"}
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
                                    {isSignup && (
                                        <p className="text-[11px] text-slate-500 mt-1.5">
                                            Must be at least 6 characters long.
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-violet-700 hover:bg-violet-800 shadow-md shadow-violet-700/20 border border-violet-600 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                                            <span>{!isSignup ? "Signing In..." : "Creating Account..."}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>{!isSignup ? "Sign In to Workspace" : "Create New Account"}</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>

                                <div className="pt-2 text-center text-xs text-slate-600">
                                    {!isSignup ? (
                                        <span>
                                            Don&apos;t have an account?{" "}
                                            <button
                                                type="button"
                                                onClick={handleOpenSignup}
                                                className="font-semibold text-violet-700 hover:text-violet-800 transition-colors cursor-pointer"
                                            >
                                                Create New Account
                                            </button>
                                        </span>
                                    ) : (
                                        <span>
                                            Already have an account?{" "}
                                            <button
                                                type="button"
                                                onClick={handleOpenLogin}
                                                className="font-semibold text-violet-700 hover:text-violet-800 transition-colors cursor-pointer"
                                            >
                                                Sign In
                                            </button>
                                        </span>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                                    <span>Encrypted transmission &amp; privacy-first design</span>
                                </div>
                            </form>
                        </div>
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