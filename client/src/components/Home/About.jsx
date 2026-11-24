import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
    UploadCloud, 
    Wand2, 
    Share2, 
    ArrowRight, 
    Gauge, 
    Sparkles 
} from "lucide-react";

export default function About() {
    const { user } = useSelector((state) => state.auth);

    const steps = [
        {
            number: "01",
            title: "Ingest & Parse",
            description: "Upload an existing PDF or Word document, or start fresh. The AI parses your technical history into clean, structured sections.",
            icon: <UploadCloud className="w-6 h-6 text-violet-600" />
        },
        {
            number: "02",
            title: "Refactor & Quantify",
            description: "Enhance bullet points with action-oriented metrics and tech keywords using Groq & Gemini. Customize layout and color themes in real time.",
            icon: <Wand2 className="w-6 h-6 text-orange-600" />
        },
        {
            number: "03",
            title: "Export & Share",
            description: "Compile a pixel-perfect, 1-page PDF using standard browser print layouts or toggle a public web link for recruiters with one click.",
            icon: <Share2 className="w-6 h-6 text-teal-600" />
        }
    ];

    return (
        <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200/80 relative">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/90 text-orange-700 text-xs font-mono uppercase tracking-wider mb-4 shadow-xs">
                        <Gauge className="w-3.5 h-3.5 text-orange-600" />
                        <span>Workflow Pipeline</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                        How It Works
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-slate-600">
                        A fast, predictable three-step process engineered to highlight your actual technical accomplishments.
                    </p>
                </div>

                {/* 3 Step Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="relative rounded-2xl bg-white border border-slate-200/90 p-8 shadow-xs hover:shadow-md hover:border-violet-300 transition-all duration-200 group flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                                        {step.icon}
                                    </div>
                                    <span className="text-3xl font-mono font-bold text-slate-200 group-hover:text-violet-200 transition-colors">
                                        {step.number}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-violet-700 transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-mono text-slate-400">
                                <span>Phase {index + 1} of 3</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tech Metrics Highlights */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-50/70 border border-slate-200/90 mb-20 font-mono text-center shadow-xs">
                    <div className="p-4">
                        <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">~30s</div>
                        <div className="text-xs text-slate-500 font-sans">Average Parse Time</div>
                    </div>
                    <div className="p-4 border-l border-slate-200">
                        <div className="text-2xl sm:text-3xl font-bold text-violet-700 mb-1">4</div>
                        <div className="text-xs text-slate-500 font-sans">Clean Templates</div>
                    </div>
                    <div className="p-4 border-t sm:border-t-0 sm:border-l border-slate-200">
                        <div className="text-2xl sm:text-3xl font-bold text-teal-700 mb-1">100%</div>
                        <div className="text-xs text-slate-500 font-sans">ATS Parse Compatibility</div>
                    </div>
                    <div className="p-4 border-t sm:border-t-0 border-l border-slate-200">
                        <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">0</div>
                        <div className="text-xs text-slate-500 font-sans">Layout Headaches</div>
                    </div>
                </div>

                {/* High-Impact CTA Box */}
                <div className="relative rounded-3xl overflow-hidden border border-violet-800/40 bg-gradient-to-br from-violet-900 via-purple-900 to-slate-950 p-8 sm:p-12 text-center shadow-xl text-white">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                            Ready to Upgrade Your Engineering Resume?
                        </h3>
                        <p className="text-sm sm:text-base text-violet-100/90 mb-8 leading-relaxed">
                            Create a clean, impactful resume optimized for recruiters and ATS scanners in minutes.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            {user ? (
                                <Link
                                    to="/app"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-violet-950 bg-white hover:bg-slate-100 shadow-md transition-all duration-150"
                                >
                                    <span>Open Resume Workspace</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/login?state=signup"
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-violet-950 bg-white hover:bg-slate-100 shadow-md transition-all duration-150"
                                    >
                                        <Sparkles className="w-4 h-4 text-violet-700" />
                                        <span>Start Building Free</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        to="/login?state=login"
                                        className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-medium text-white hover:bg-white/10 border border-white/20 transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}