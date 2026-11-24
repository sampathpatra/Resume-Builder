import React, { useState, useEffect } from "react";
import { 
    Plus, 
    UploadCloud, 
    FileText, 
    Trash2, 
    Pencil, 
    X, 
    Loader2, 
    Sparkles, 
    ArrowRight, 
    Search, 
    Globe, 
    Lock, 
    ExternalLink, 
    Layers,
    BarChart2,
    CheckCircle2,
    FileCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";

export default function Dashboard() {
    const { user, token } = useSelector((state) => state.auth);
    const [allResumes, setAllResumes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterVisibility, setFilterVisibility] = useState("all"); // 'all', 'public', 'private'
    const [showCreateResume, setshowCreateResume] = useState(false);
    const [showUploadResume, setshowUploadResume] = useState(false);
    const [title, settitle] = useState("");
    const [resume, setresume] = useState(null);
    const [editResumeId, seteditResumeId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const loadAllResume = async () => {
        try {
            const { data } = await api.get("/api/users/resumes", { headers: { Authorization: token } });
            setAllResumes(data.resumes || []);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const createResume = async (event) => {
        try {
            event.preventDefault();
            const { data } = await api.post("/api/resumes/create", { title }, { headers: { Authorization: token } });
            setAllResumes([...allResumes, data.resume]);
            settitle("");
            setshowCreateResume(false);
            navigate(`/app/builder/${data.resume._id}`);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const uploadResume = async (event) => {
        event.preventDefault();
        if (!resume) {
            return toast.error("Please select a PDF file first");
        }
        setIsLoading(true);
        try {
            const resumeText = await pdfToText(resume);
            const { data } = await api.post("/api/ai/upload-resume", { title, resumeText }, { headers: { Authorization: token } });
            settitle("");
            setresume(null);
            setshowUploadResume(false);
            navigate(`/app/builder/${data.resumeId}`);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        }
        setIsLoading(false);
    };

    const editTitle = async (event) => {
        try {
            event.preventDefault();
            const { data } = await api.put(
                `/api/resumes/update`, 
                { resumeId: editResumeId, resumeData: JSON.stringify({ title }) }, 
                { headers: { Authorization: token } }
            );
            setAllResumes(allResumes.map(r => r._id === editResumeId ? { ...r, title } : r));
            settitle("");
            seteditResumeId("");
            toast.success(data.message || "Title updated successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const deleteResume = async (resumeId) => {
        try {
            const confirm = window.confirm("Are you sure you want to delete this resume? This cannot be undone.");
            if (confirm) {
                const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, { headers: { Authorization: token } });
                setAllResumes(allResumes.filter(r => r._id !== resumeId));
                toast.success(data.message || "Resume deleted");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        loadAllResume();
    }, []);

    // Calculate section completion percentage based on populated data
    const calculateCompletion = (r) => {
        if (!r) return 0;
        let score = 0;
        if (r.personal_info?.full_name || r.personal_info?.email) score += 20;
        if (r.professional_summary && r.professional_summary.trim().length > 10) score += 20;
        if (r.experience && r.experience.length > 0) score += 25;
        if (r.skills && r.skills.length > 0) score += 15;
        if (r.education && r.education.length > 0) score += 10;
        if (r.projects && r.projects.length > 0) score += 10;
        return Math.min(score, 100);
    };

    // Filter resumes by search query and public/private visibility
    const filteredResumes = allResumes.filter((r) => {
        const matchesSearch = (r.title || "Untitled Resume").toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;
        if (filterVisibility === "public") return r.public === true;
        if (filterVisibility === "private") return r.public !== true;
        return true;
    });

    const publicCount = allResumes.filter((r) => r.public).length;
    const avgCompletion = allResumes.length
        ? Math.round(allResumes.reduce((acc, r) => acc + calculateCompletion(r), 0) / allResumes.length)
        : 0;

    return (
        <div className="relative min-h-[calc(100vh-5rem)] bg-[#FAFAF9] overflow-hidden">
            {/* Subtle background light grid */}
            <div className="absolute inset-0 bg-light-grid opacity-50 pointer-events-none" />

            {/* Slow, Elegant Ambient Floating Lights (Edge & Perimeter Placement matching Homepage) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
                {/* Soft Violet Shape - Top Left Edge */}
                <div className="absolute -top-20 -left-20 sm:-top-28 sm:-left-28 w-72 sm:w-[480px] h-72 sm:h-[480px] bg-violet-200/25 rounded-full blur-[100px] sm:blur-[140px] animate-ambient-1" />
                {/* Muted Coral / Warm Peach Shape - Top Right Edge */}
                <div className="absolute top-8 -right-20 sm:top-12 sm:-right-28 w-64 sm:w-[440px] h-64 sm:h-[440px] bg-orange-100/30 rounded-full blur-[90px] sm:blur-[130px] animate-ambient-2" />
                {/* Refined Teal / Mint Glow - Bottom Left Edge */}
                <div className="absolute -bottom-20 left-8 sm:left-20 w-64 sm:w-[400px] h-64 sm:h-[400px] bg-teal-100/20 rounded-full blur-[90px] sm:blur-[130px] animate-ambient-3" />
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Hero-Style Workspace Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 border-b border-slate-200/80">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/80 shadow-2xs mb-3 hover:border-violet-300 transition-colors">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-xs font-medium text-slate-700">Workspace Hub</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Welcome back, {user?.name || "Developer"}
                        </h1>
                        <p className="mt-2 text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
                            Create, refine, and manage your resumes from one workspace.
                        </p>
                    </div>

                    {/* Actions: Primary, Secondary, and AI Shortcut */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <button
                            onClick={() => {
                                settitle("");
                                setshowCreateResume(true);
                            }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-violet-700 hover:bg-violet-800 shadow-sm shadow-violet-700/20 border border-violet-600 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create Resume</span>
                        </button>

                        <button
                            onClick={() => {
                                settitle("");
                                setresume(null);
                                setshowUploadResume(true);
                            }}
                            className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs transition-all duration-150 hover:border-slate-300 cursor-pointer"
                        >
                            <UploadCloud className="w-4 h-4 text-violet-600" />
                            <span>Import PDF</span>
                        </button>

                        <button
                            onClick={() => navigate("/app/ai-analyzer")}
                            className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs transition-all duration-150 hover:border-violet-300 cursor-pointer group"
                        >
                            <Sparkles className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
                            <span className="hidden sm:inline">AI Analyzer</span>
                        </button>
                    </div>
                </div>

                {/* Minimalist Stats Cards Area */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-8 font-sans">
                    {/* Stat 1: Total Resumes */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 mb-1">Total Resumes</p>
                            <p className="text-2xl font-bold text-slate-900 tracking-tight">{allResumes.length}</p>
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-violet-600 shadow-xs" title="Total active documents" />
                    </div>

                    {/* Stat 2: Public Links */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 mb-1">Public Links</p>
                            <p className="text-2xl font-bold text-slate-900 tracking-tight">{publicCount}</p>
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-xs" title="Published publicly" />
                    </div>

                    {/* Stat 3: Average Completion */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 mb-1">Avg. Completion</p>
                            <p className="text-2xl font-bold text-slate-900 tracking-tight">{avgCompletion}%</p>
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-xs" title="Average profile strength" />
                    </div>

                    {/* Stat 4: Interview Coach */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 mb-0.5">Interview Coach</p>
                            <p className="text-xs font-semibold text-violet-700">AI Preparation</p>
                        </div>
                        <button
                            onClick={() => navigate("/app/ai-analyzer")}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors shadow-2xs cursor-pointer"
                        >
                            <span>Launch</span>
                            <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search resumes by title..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-violet-600 focus:ring-1 focus:ring-violet-600 shadow-2xs"
                        />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs self-start sm:self-auto text-xs font-medium text-slate-600">
                        <button
                            onClick={() => setFilterVisibility("all")}
                            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                filterVisibility === "all" ? "bg-slate-100 text-slate-900 font-semibold" : "hover:text-slate-900"
                            }`}
                        >
                            All ({allResumes.length})
                        </button>
                        <button
                            onClick={() => setFilterVisibility("public")}
                            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                filterVisibility === "public" ? "bg-slate-100 text-slate-900 font-semibold" : "hover:text-slate-900"
                            }`}
                        >
                            Public ({publicCount})
                        </button>
                        <button
                            onClick={() => setFilterVisibility("private")}
                            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                filterVisibility === "private" ? "bg-slate-100 text-slate-900 font-semibold" : "hover:text-slate-900"
                            }`}
                        >
                            Private ({allResumes.length - publicCount})
                        </button>
                    </div>
                </div>

                {/* Resume Cards Grid */}
                {filteredResumes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResumes.map((r) => {
                            const completion = calculateCompletion(r);
                            const accent = r.accent_color || "#7C3AED";
                            const expCount = r.experience?.length || 0;
                            const skillCount = r.skills?.length || 0;
                            const projectCount = r.projects?.length || 0;
                            const dateFormatted = new Date(r.updatedAt || r.createdAt || Date.now()).toLocaleDateString(
                                undefined,
                                { month: "short", day: "numeric", year: "numeric" }
                            );

                            return (
                                <div
                                    key={r._id}
                                    className="group relative bg-white border border-slate-200/80 hover:border-violet-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Card Top Row: Template Badge, Visibility, and Menu Actions */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                {/* Template Badge */}
                                                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono capitalize bg-violet-50 text-violet-700 border border-violet-200/70 font-medium">
                                                    {r.template || "classic"}
                                                </span>

                                                {/* Visibility Chip */}
                                                {r.public ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200">
                                                        <Globe className="w-3 h-3" />
                                                        <span>Public</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200/80">
                                                        <Lock className="w-3 h-3" />
                                                        <span>Private</span>
                                                    </span>
                                                )}
                                            </div>

                                            {/* Action Menu Buttons */}
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        seteditResumeId(r._id);
                                                        settitle(r.title);
                                                    }}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                                    title="Rename resume"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>

                                                {r.public && (
                                                    <a
                                                        href={`/view/${r._id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors cursor-pointer"
                                                        title="View public link"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </a>
                                                )}

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteResume(r._id);
                                                    }}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                                    title="Delete resume"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Card Title & Accent Color Swatch */}
                                        <div className="flex items-start gap-2.5 mb-4">
                                            <div
                                                className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 shadow-2xs"
                                                style={{ backgroundColor: accent }}
                                                title={`Theme color: ${accent}`}
                                            />
                                            <h3
                                                onClick={() => navigate(`/app/builder/${r._id}`)}
                                                className="font-bold text-base text-slate-900 group-hover:text-violet-700 cursor-pointer transition-colors leading-snug line-clamp-1"
                                            >
                                                {r.title || "Untitled Resume"}
                                            </h3>
                                        </div>

                                        {/* Profile Completion Progress Bar */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                                                <span className="text-slate-500 font-sans">Completion</span>
                                                <span className="font-semibold text-slate-700">{completion}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-violet-600 to-indigo-600 h-1.5 rounded-full transition-all duration-300"
                                                    style={{ width: `${completion}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Metadata Summary Chips */}
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-mono">
                                            <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-200/80">
                                                {expCount} {expCount === 1 ? "Role" : "Roles"}
                                            </span>
                                            <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-200/80">
                                                {skillCount} {skillCount === 1 ? "Skill" : "Skills"}
                                            </span>
                                            {projectCount > 0 && (
                                                <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-200/80">
                                                    {projectCount} {projectCount === 1 ? "Project" : "Projects"}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                                        <span className="text-slate-400">Updated {dateFormatted}</span>
                                        <button
                                            onClick={() => navigate(`/app/builder/${r._id}`)}
                                            className="inline-flex items-center gap-1 font-semibold text-violet-700 group-hover:text-violet-900 transition-colors cursor-pointer"
                                        >
                                            <span>Open Editor</span>
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Clean Empty State (Consistent with Homepage) */
                    <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto my-12 shadow-xs">
                        <div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-700 mx-auto mb-4 shadow-xs">
                            <FileText className="w-7 h-7 text-violet-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                            {searchQuery ? "No matching resumes found" : "No resumes created yet"}
                        </h3>
                        <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto leading-relaxed">
                            {searchQuery
                                ? "Try adjusting your search terms or clear the filter."
                                : "Start building your career portfolio by creating a blank resume or uploading an existing document."}
                        </p>
                        {searchQuery ? (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                                Clear Search Filter
                            </button>
                        ) : (
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <button
                                    onClick={() => {
                                        settitle("");
                                        setshowCreateResume(true);
                                    }}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-violet-700 hover:bg-violet-800 transition-colors shadow-sm cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create Blank Resume</span>
                                </button>
                                <button
                                    onClick={() => {
                                        settitle("");
                                        setresume(null);
                                        setshowUploadResume(true);
                                    }}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    <UploadCloud className="w-4 h-4 text-violet-600" />
                                    <span>Import Existing PDF</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal: Create Blank Resume */}
            {showCreateResume && (
                <div
                    onClick={() => setshowCreateResume(false)}
                    className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl"
                    >
                        <button
                            onClick={() => {
                                setshowCreateResume(false);
                                settitle("");
                            }}
                            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-700">
                                <Plus className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Create New Resume</h2>
                                <p className="text-xs text-slate-500">Give your resume a title to start customizing.</p>
                            </div>
                        </div>

                        <form onSubmit={createResume} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Resume Title
                                </label>
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="e.g. Senior Full Stack Engineer"
                                    value={title}
                                    onChange={(e) => settitle(e.target.value)}
                                    required
                                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-violet-600 focus:ring-1 focus:ring-violet-600 shadow-2xs"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setshowCreateResume(false);
                                        settitle("");
                                    }}
                                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-violet-700 hover:bg-violet-800 shadow-sm shadow-violet-700/20 transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                    <span>Create & Open</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Upload & Import Resume */}
            {showUploadResume && (
                <div
                    onClick={() => setshowUploadResume(false)}
                    className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl"
                    >
                        <button
                            onClick={() => {
                                setshowUploadResume(false);
                                settitle("");
                                setresume(null);
                            }}
                            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                                <UploadCloud className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Import Resume from PDF</h2>
                                <p className="text-xs text-slate-500">AI will automatically parse sections into editable data.</p>
                            </div>
                        </div>

                        <form onSubmit={uploadResume} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Resume Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Imported Software Engineer Resume"
                                    value={title}
                                    onChange={(e) => settitle(e.target.value)}
                                    required
                                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-violet-600 focus:ring-1 focus:ring-violet-600 shadow-2xs"
                                />
                            </div>

                            {/* Dropzone */}
                            <div>
                                <label
                                    htmlFor="resume-file-input"
                                    className="group flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-200 hover:border-violet-400 rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-violet-50/30 transition-all text-center"
                                >
                                    {resume ? (
                                        <div className="flex items-center gap-2 text-violet-700 font-medium text-xs">
                                            <FileCheck className="w-6 h-6 text-teal-600" />
                                            <span className="truncate max-w-[200px]">{resume.name}</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-violet-600 shadow-2xs transition-colors">
                                                <UploadCloud className="w-5 h-5" />
                                            </div>
                                            <p className="text-xs font-medium text-slate-700">Click to select a PDF file</p>
                                            <p className="text-[11px] text-slate-400">PDF up to 10MB</p>
                                        </>
                                    )}
                                </label>
                                <input
                                    id="resume-file-input"
                                    type="file"
                                    accept=".pdf"
                                    hidden
                                    onChange={(e) => setresume(e.target.files[0])}
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setshowUploadResume(false);
                                        settitle("");
                                        setresume(null);
                                    }}
                                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-violet-700 hover:bg-violet-800 disabled:opacity-50 shadow-sm shadow-violet-700/20 transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                    {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    <span>{isLoading ? "Parsing with AI..." : "Upload & Parse"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Edit Title */}
            {editResumeId && (
                <div
                    onClick={() => seteditResumeId("")}
                    className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl"
                    >
                        <button
                            onClick={() => {
                                seteditResumeId("");
                                settitle("");
                            }}
                            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-700">
                                <Pencil className="w-4.5 h-4.5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Rename Resume</h2>
                                <p className="text-xs text-slate-500">Update the title of your resume document.</p>
                            </div>
                        </div>

                        <form onSubmit={editTitle} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    New Title
                                </label>
                                <input
                                    type="text"
                                    autoFocus
                                    value={title}
                                    onChange={(e) => settitle(e.target.value)}
                                    required
                                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-violet-600 focus:ring-1 focus:ring-violet-600 shadow-2xs"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        seteditResumeId("");
                                        settitle("");
                                    }}
                                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-violet-700 hover:bg-violet-800 shadow-sm shadow-violet-700/20 transition-all cursor-pointer"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}