import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Sparkles, Menu, X, ArrowRight, LayoutDashboard, FileText } from "lucide-react";

export default function HomeNavbar() {
    const { user } = useSelector((state) => state.auth);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "How It Works", href: "#about" },
        { name: "ATS Optimization", href: "#features" },
    ];

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-white/85 backdrop-blur-md border-b border-slate-200/90 shadow-sm"
                    : "bg-[#FAFAF9]/70 backdrop-blur-xs border-b border-slate-200/40"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Brand / Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-700 shadow-xs group-hover:bg-violet-100 group-hover:border-violet-300 transition-all duration-200">
                            <FileText className="w-5 h-5 text-violet-700 group-hover:scale-105 transition-transform" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-violet-800 transition-colors">
                            DevResume<span className="text-violet-600">.ai</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-1 bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="px-3.5 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all duration-150"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop Auth CTAs */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <Link
                                to="/app"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-violet-700 hover:bg-violet-800 shadow-sm shadow-violet-700/20 border border-violet-600 transition-all duration-150 hover:-translate-y-0.5"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                <span>Dashboard</span>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login?state=login"
                                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 rounded-xl transition-all duration-150"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/login?state=signup"
                                    className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-sm font-semibold text-white bg-violet-700 hover:bg-violet-800 shadow-md shadow-violet-700/20 border border-violet-600 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <span>Get Started Free</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 focus:outline-hidden transition-colors shadow-xs"
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="space-y-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:text-violet-700 hover:bg-violet-50/60 transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex flex-col gap-2.5">
                        {user ? (
                            <Link
                                to="/app"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-violet-700 hover:bg-violet-800 shadow-sm"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                <span>Go to Dashboard</span>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login?state=login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full text-center px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/login?state=signup"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-violet-700 hover:bg-violet-800 shadow-md shadow-violet-700/20"
                                >
                                    <span>Get Started Free</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
