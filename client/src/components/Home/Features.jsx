import React from "react";
import { 
    Zap, 
    Sparkles, 
    CheckCircle2, 
    Layers, 
    MessageSquareCode,
    Cpu
} from "lucide-react";

export default function Features() {
    return (
        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAF9] relative overflow-hidden border-t border-slate-200/60">
            {/* Subtle Ambient Light Glows */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-violet-100/40 rounded-full blur-[110px] pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-orange-100/35 rounded-full blur-[90px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200/90 text-violet-700 text-xs font-mono uppercase tracking-wider mb-4 shadow-xs">
                        <Cpu className="w-3.5 h-3.5 text-violet-600" />
                        <span>Core Capabilities</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                        Built for Technical Clarity & Speed
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-slate-600">
                        Everything you need to turn complex software projects, git workflows, and tech stacks into a clean, compelling engineering resume.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1: Large 2-Col Bullet Optimization Diff */}
                    <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-md hover:border-violet-300 transition-all duration-200 group flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-5">
                                <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-700 group-hover:scale-105 transition-transform shadow-xs">
                                    <Sparkles className="w-6 h-6 text-violet-600" />
                                </div>
                                <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                    AI Refactor Engine
                                </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-violet-700 transition-colors">
                                Impact-Driven Experience Refactoring
                            </h3>
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                                Turn vague task descriptions into quantified technical achievements optimized with strong engineering action verbs.
                            </p>
                        </div>

                        {/* Visual Code Diff Preview */}
                        <div className="rounded-xl bg-slate-50/80 border border-slate-200 p-4 font-mono text-xs space-y-2.5">
                            <div className="flex items-start gap-2.5 bg-rose-50/80 border border-rose-200/80 text-rose-950 p-3.5 rounded-lg shadow-xs">
                                <span className="text-rose-500 font-bold select-none text-sm">-</span>
                                <div>
                                    <span className="text-[10px] text-rose-600 block uppercase font-semibold">Unoptimized Raw Input:</span>
                                    <span>"Helped maintain our backend APIs and made database queries run faster."</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-2.5 bg-teal-50/90 border border-teal-200 text-teal-950 p-3.5 rounded-lg shadow-xs">
                                <span className="text-teal-600 font-bold select-none text-sm">+</span>
                                <div>
                                    <span className="text-[10px] text-teal-700 block uppercase font-semibold">AI-Enhanced Engineering Bullet:</span>
                                    <span>"Architected high-throughput REST APIs in Node.js and indexed MongoDB collections, slashing p95 response time by 48% under concurrent load."</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Multi-Model AI Engine */}
                    <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-md hover:border-violet-300 transition-all duration-200 group flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 group-hover:scale-105 transition-transform mb-5 shadow-xs">
                                <Zap className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                                Multi-Model AI Routing
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                Uses Groq (LLaMA 3.3 70B) for sub-second interactive bullet generation, with Google Gemini 2.0 Flash for structured document parsing.
                            </p>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-slate-100 font-mono text-xs">
                            <div className="flex justify-between items-center bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200/80">
                                <span className="text-slate-700 font-medium">Groq LLaMA 3.3</span>
                                <span className="text-teal-700 font-semibold">~350ms latency</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200/80">
                                <span className="text-slate-700 font-medium">Google Gemini 2.0</span>
                                <span className="text-violet-700 font-semibold">Deep Context</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Interactive Interview Coach */}
                    <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-md hover:border-violet-300 transition-all duration-200 group flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-700 group-hover:scale-105 transition-transform mb-5 shadow-xs">
                                <MessageSquareCode className="w-6 h-6 text-violet-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-violet-700 transition-colors">
                                Technical Interview Coach
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                Built-in Smart AI Analyzer scans your project history and generates role-specific technical interview questions to test your talking points.
                            </p>
                        </div>

                        <div className="bg-violet-50/60 p-4 rounded-xl border border-violet-200/80 font-mono text-[11px] text-slate-700">
                            <span className="text-violet-800 font-semibold block mb-1">Generated Sample:</span>
                            "Describe how you handled state synchronization across concurrent tabs in your dashboard project?"
                        </div>
                    </div>

                    {/* Card 4: ATS Structural Compiler */}
                    <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-md hover:border-violet-300 transition-all duration-200 group flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 group-hover:scale-105 transition-transform mb-5 shadow-xs">
                                <CheckCircle2 className="w-6 h-6 text-teal-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
                                ATS-Verified Architecture
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                Zero multi-column parsing traps or unreadable icons. Your resume is rendered with standard hierarchical HTML that ATS parsers ingest flawlessly.
                            </p>
                        </div>

                        <ul className="space-y-2 text-xs text-slate-700 pt-3 border-t border-slate-100 font-medium">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                                Standardized section heading tags
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                                Clean selectable text, no canvas rasterization
                            </li>
                        </ul>
                    </div>

                    {/* Card 5: Multi-Template & Instant PDF Export */}
                    <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-md hover:border-violet-300 transition-all duration-200 group flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 group-hover:scale-105 transition-transform mb-5 shadow-xs">
                                <Layers className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-700 transition-colors">
                                Real-Time Live Preview & Print
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                Toggle between Modern, Minimal, and Classic engineering layouts with real-time color accents, and download print-ready vector PDFs in 1 click.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 font-mono text-xs text-slate-600">
                            <span className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-medium">Modern</span>
                            <span className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-medium">Minimal</span>
                            <span className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-medium">Classic</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}