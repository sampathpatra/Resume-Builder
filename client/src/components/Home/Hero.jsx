import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
    Sparkles, 
    ArrowRight, 
    Terminal, 
    Check, 
    Code2, 
    CheckCircle2
} from "lucide-react";

export default function Hero() {
    const { user } = useSelector((state) => state.auth);

    return (
        <section className="relative min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-8 pb-20 overflow-hidden bg-[#FAFAF9]">
            {/* Subtle light background grid */}
            <div className="absolute inset-0 bg-light-grid opacity-60 pointer-events-none" />

            {/* Subtle, Elegant Ambient Floating Gradient Lights (Edge & Background Placement) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
                {/* Soft Violet Shape - Top Left Edge */}
                <div className="absolute -top-16 -left-16 sm:-top-24 sm:-left-24 w-72 sm:w-[480px] h-72 sm:h-[480px] bg-violet-200/30 rounded-full blur-[100px] sm:blur-[140px] animate-ambient-1" />
                {/* Muted Coral / Warm Peach Shape - Top Right Edge */}
                <div className="absolute top-6 -right-16 sm:top-12 sm:-right-24 w-64 sm:w-[440px] h-64 sm:h-[440px] bg-orange-100/35 rounded-full blur-[90px] sm:blur-[130px] animate-ambient-2" />
                {/* Refined Teal / Mint Glow - Bottom Left Edge */}
                <div className="absolute -bottom-16 left-6 sm:left-16 w-64 sm:w-[400px] h-64 sm:h-[400px] bg-teal-100/25 rounded-full blur-[90px] sm:blur-[130px] animate-ambient-3" />
            </div>

            {/* Central Content */}
            <div className="relative z-10 max-w-5xl mx-auto text-center mt-2">
                {/* Tech Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs mb-6 hover:border-violet-300 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-xs sm:text-sm font-medium text-slate-700">
                        AI-assisted resume building for developers
                    </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.12]">
                    Engineered for Developers. <br />
                    <span className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 bg-clip-text text-transparent">
                        Resumes Built Like Production Code.
                    </span>
                </h1>

                {/* Subheading */}
                <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
                    Transform your engineering experience, technical stack, and project achievements into clean, high-impact resumes with multi-model AI assistance, real-time live preview, and verified ATS compatibility.
                </p>

                {/* Action CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                    {user ? (
                        <Link
                            to="/app"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-semibold text-white bg-violet-700 hover:bg-violet-800 shadow-lg shadow-violet-700/20 border border-violet-600 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <span>Go to Dashboard</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    ) : (
                        <Link
                            to="/login?state=signup"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-semibold text-white bg-violet-700 hover:bg-violet-800 shadow-lg shadow-violet-700/20 border border-violet-600 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <Sparkles className="w-5 h-5 text-violet-200" />
                            <span>Start Building — Free</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    )}

                    <a
                        href="#features"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs hover:border-slate-300 transition-all duration-150"
                    >
                        <Terminal className="w-4 h-4 text-violet-600" />
                        <span>Explore Capabilities</span>
                    </a>
                </div>

                {/* Factual Value Props */}
                <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-600 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-teal-600" />
                        Groq & Gemini AI Models
                    </span>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-teal-600" />
                        ATS-Friendly Clean Markup
                    </span>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-teal-600" />
                        Zero Config 1-Page PDF Export
                    </span>
                </div>
            </div>

            {/* Interactive Developer IDE / Split-Screen Preview Mockup */}
            <div className="relative z-10 w-full max-w-5xl mx-auto mt-14 sm:mt-16">
                <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/60 overflow-hidden">
                    {/* Window Title Bar */}
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50/90 border-b border-slate-200/80 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
                            <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
                            <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
                            <div className="ml-3 hidden sm:flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-md text-[11px] font-mono text-slate-700 shadow-xs">
                                <Code2 className="w-3.5 h-3.5 text-violet-600" />
                                <span>resume.config.ts</span>
                            </div>
                            <div className="hidden md:flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-mono text-slate-400">
                                <span>experience.json</span>
                            </div>
                        </div>

                        {/* Status Chip */}
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/80 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                                ATS Score: 98/100
                            </span>
                        </div>
                    </div>

                    {/* Window Body (Split Editor & Live Preview) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 font-mono">
                        {/* Left Code Editor Pane */}
                        <div className="lg:col-span-6 p-4 sm:p-6 bg-slate-50/60 text-left text-xs sm:text-[13px] leading-relaxed overflow-x-auto">
                            <div className="text-slate-400 mb-2">// 1. Structured technical profile input</div>
                            <div className="space-y-1">
                                <p><span className="text-violet-700 font-semibold">const</span> <span className="text-slate-900 font-semibold">engineerProfile</span> = {"{"}</p>
                                <p className="pl-4"><span className="text-indigo-900">role</span>: <span className="text-teal-700">"Senior Full Stack Engineer"</span>,</p>
                                <p className="pl-4"><span className="text-indigo-900">coreStack</span>: [<span className="text-teal-700">"TypeScript"</span>, <span className="text-teal-700">"React 19"</span>, <span className="text-teal-700">"Node.js"</span>, <span className="text-teal-700">"PostgreSQL"</span>],</p>
                                <p className="pl-4"><span className="text-indigo-900">experience</span>: [</p>
                                <div className="pl-8 bg-violet-50/80 border-l-2 border-violet-500 py-1.5 my-1 rounded-r">
                                    <p className="text-violet-700 font-medium">// AI-enhanced impact bullet:</p>
                                    <p className="text-slate-800">
                                        <span className="text-teal-800">"Architected distributed APIs reducing p95 latency by 38% under high load."</span>
                                    </p>
                                </div>
                                <p className="pl-4">]</p>
                                <p>{"};"}</p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                                <span className="text-violet-700 font-medium">⚡ LLM Engine: Groq llama-3.3-70b</span>
                                <span>Compiled in 320ms</span>
                            </div>
                        </div>

                        {/* Right Formatted Resume Preview Pane */}
                        <div className="lg:col-span-6 p-4 sm:p-6 bg-white text-left">
                            <div className="bg-slate-50/70 text-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs font-sans">
                                <div className="border-b border-slate-200 pb-3 mb-3">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-base sm:text-lg font-bold text-slate-900">Alex Rivera</h2>
                                        <span className="text-[10px] font-semibold tracking-wider text-violet-700 uppercase bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
                                            Modern Template
                                        </span>
                                    </div>
                                    <p className="text-xs font-medium text-violet-700">Senior Full Stack Engineer</p>
                                    <p className="text-[10px] text-slate-500 mt-1">alex.rivera@dev.io • github.com/arivera • San Francisco, CA</p>
                                </div>

                                <div className="space-y-3 text-[11px]">
                                    <div>
                                        <h3 className="font-bold text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-1">
                                            Technical Experience
                                        </h3>
                                        <div className="flex justify-between font-semibold text-slate-800 text-xs">
                                            <span>TechCore Systems • Staff Platform Lead</span>
                                            <span className="text-slate-500 font-normal">2022 - Present</span>
                                        </div>
                                        <ul className="list-disc pl-4 text-slate-600 space-y-0.5 mt-1">
                                            <li>Architected distributed microservices handling 40M+ daily events.</li>
                                            <li>Streamlined frontend data pipelines using React concurrent rendering.</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-1">
                                            Core Technologies
                                        </h3>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {["TypeScript", "React 19", "Node.js", "Docker", "PostgreSQL", "Tailwind CSS"].map((tech) => (
                                                <span key={tech} className="px-2 py-0.5 rounded bg-white text-slate-700 text-[10px] font-mono border border-slate-200/80 shadow-xs">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
