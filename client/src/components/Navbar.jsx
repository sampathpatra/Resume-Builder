import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../app/features/authSlice';
import { FileText, Sparkles, Layers, LogOut, Menu, X, Home } from 'lucide-react';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const logoutUser = () => {
        dispatch(logout());
        navigate('/');
    };

    const isAnalyzerActive = location.pathname.includes('/app/ai-analyzer');
    const isDashboardActive = location.pathname === '/app' || location.pathname.startsWith('/app/builder');

    const userInitial = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'U';

    return (
        <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/90 shadow-2xs transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Brand Lockup (Matches Homepage 1:1) */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-700 shadow-xs group-hover:bg-violet-100 group-hover:border-violet-300 transition-all duration-200">
                                <FileText className="w-5 h-5 text-violet-700 group-hover:scale-105 transition-transform" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-violet-800 transition-colors">
                                DevResume<span className="text-violet-600">.ai</span>
                            </span>
                        </Link>

                        {/* Desktop Center Navigation (Pill container matching HomeNavbar) */}
                        <nav className="hidden md:flex items-center gap-1 bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
                            <Link
                                to="/app"
                                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-full transition-all duration-150 ${
                                    isDashboardActive && !isAnalyzerActive
                                        ? 'bg-violet-50 text-violet-700 font-semibold'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                <Layers className="w-3.5 h-3.5 text-violet-600" />
                                <span>My Resumes</span>
                            </Link>

                            <Link
                                to="/app/ai-analyzer"
                                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-full transition-all duration-150 ${
                                    isAnalyzerActive
                                        ? 'bg-violet-50 text-violet-700 font-semibold'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                                <span>AI Analyzer</span>
                            </Link>

                            <Link
                                to="/"
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all duration-150"
                            >
                                <Home className="w-3.5 h-3.5 text-slate-400" />
                                <span>Homepage</span>
                            </Link>
                        </nav>
                    </div>

                    {/* Right: User Profile & Actions */}
                    <div className="flex items-center gap-3">
                        {/* Refined User Profile Pill */}
                        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                            <div className="w-7 h-7 rounded-lg bg-violet-100 border border-violet-200/80 text-violet-700 font-bold text-xs flex items-center justify-center">
                                {userInitial}
                            </div>
                            <div className="hidden sm:block text-left text-xs">
                                <p className="font-semibold text-slate-800 leading-tight truncate max-w-[130px]">
                                    {user?.name || 'Developer'}
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono">Workspace</p>
                            </div>
                        </div>

                        {/* Ghost Logout Button */}
                        <button
                            onClick={logoutUser}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 transition-all shadow-2xs active:scale-95 cursor-pointer"
                            title="Sign out of your account"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 focus:outline-hidden transition-colors shadow-2xs cursor-pointer"
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-4 duration-200">
                    <Link
                        to="/app"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                            isDashboardActive && !isAnalyzerActive
                                ? 'bg-violet-50 text-violet-700 font-semibold'
                                : 'text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                        <Layers className="w-4 h-4 text-violet-600" />
                        <span>My Resumes</span>
                    </Link>

                    <Link
                        to="/app/ai-analyzer"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                            isAnalyzerActive
                                ? 'bg-violet-50 text-violet-700 font-semibold'
                                : 'text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        <span>AI Analyzer</span>
                    </Link>

                    <Link
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        <Home className="w-4 h-4 text-slate-400" />
                        <span>Homepage</span>
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Navbar;