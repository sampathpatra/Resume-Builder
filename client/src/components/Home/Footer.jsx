import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Code2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email) return;
        setSubscribed(true);
        toast.success("Subscribed to DevResume changelog updates!");
        setEmail("");
    };

    return (
        <footer className="bg-slate-50 border-t border-slate-200/90 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-slate-600 text-sm">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
                    {/* Brand Column (2 cols wide) */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link to="/" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-700 shadow-xs">
                                <Code2 className="w-4 h-4 text-violet-700" />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-slate-900">
                                DevResume<span className="text-violet-600">.ai</span>
                            </span>
                        </Link>
                        <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                            An open, AI-assisted resume platform for software engineers. Engineered to transform complex technical experience into clean, ATS-optimized resumes.
                        </p>

                        {/* Operational Status Badge */}
                        <div className="pt-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-mono text-slate-700 shadow-xs">
                                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                                <span>All Systems Operational</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 1: Platform */}
                    <div>
                        <h4 className="text-slate-900 font-semibold text-xs tracking-wider uppercase font-mono mb-4">
                            Platform
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <a href="#features" className="hover:text-violet-700 transition-colors">
                                    Core Features
                                </a>
                            </li>
                            <li>
                                <a href="#about" className="hover:text-violet-700 transition-colors">
                                    Workflow Pipeline
                                </a>
                            </li>
                            <li>
                                <Link to="/app" className="hover:text-violet-700 transition-colors">
                                    Resume Workspace
                                </Link>
                            </li>
                            <li>
                                <Link to="/app/ai-analyzer" className="hover:text-violet-700 transition-colors">
                                    Smart AI Analyzer
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Tech Specs */}
                    <div>
                        <h4 className="text-slate-900 font-semibold text-xs tracking-wider uppercase font-mono mb-4">
                            Capabilities
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <span className="text-slate-600">Groq LLaMA 3.3 Engine</span>
                            </li>
                            <li>
                                <span className="text-slate-600">Google Gemini 2.0 Flash</span>
                            </li>
                            <li>
                                <span className="text-slate-600">ATS Structural Parsing</span>
                            </li>
                            <li>
                                <span className="text-slate-600">One-Click PDF Compile</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Newsletter */}
                    <div>
                        <h4 className="text-slate-900 font-semibold text-xs tracking-wider uppercase font-mono mb-4">
                            Changelog Updates
                        </h4>
                        <p className="text-xs text-slate-500 mb-3">
                            Subscribe for feature drops, template updates, and AI prompts.
                        </p>

                        <form onSubmit={handleSubscribe} className="space-y-2">
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="developer@company.com"
                                    required
                                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-violet-600 focus:ring-1 focus:ring-violet-600 font-mono shadow-xs"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 px-3 rounded-xl bg-violet-700 hover:bg-violet-800 text-white text-xs font-semibold font-mono transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-violet-700/20"
                            >
                                <span>{subscribed ? "Subscribed!" : "Subscribe"}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 mt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <p className="text-slate-500">
                        &copy; {new Date().getFullYear()} DevResume.ai. Engineered for developers.
                    </p>

                    <div className="flex items-center gap-6">
                        <a href="#features" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
                        <span className="text-slate-300">•</span>
                        <a href="#features" className="hover:text-slate-800 transition-colors">Terms of Service</a>
                        <span className="text-slate-300">•</span>
                        <a href="#features" className="hover:text-slate-800 transition-colors">Security</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}