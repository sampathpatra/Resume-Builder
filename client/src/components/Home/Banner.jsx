import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Banner() {
    return (
        <aside aria-label="Announcement" className="relative z-40 bg-gradient-to-r from-violet-50/95 via-purple-50/80 to-amber-50/70 border-b border-violet-100 text-xs sm:text-sm py-2 px-4 text-center">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white text-violet-800 border border-violet-200 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                    Latest Release
                </span>
                <span className="text-slate-700 font-medium">
                    AI-assisted resume building with fast multi-model inference & live ATS optimization.
                </span>
                <a
                    href="#features"
                    className="inline-flex items-center gap-1 font-semibold text-violet-700 hover:text-violet-900 transition-colors ml-1"
                >
                    <span>Explore capabilities</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </a>
            </div>
        </aside>
    );
}