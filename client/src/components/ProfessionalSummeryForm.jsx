
import { Loader2, Sparkle, Check } from "lucide-react";
import { useSelector } from "react-redux";
import { useState } from "react";
import api from "../configs/api";
import toast from "react-hot-toast";

export default function ProfessionalSummeryForm({
    data,
    onChange,
    setresumeData
}) {
    const { token } = useSelector(state => state.auth);

    const [isGenerating, setIsGenerating] = useState(false);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

    const generateSummery = async () => {
        if (!data || !data.trim()) {
            toast.error("Please write a professional summary first.");
            return;
        }

        try {
            setIsGenerating(true);
            setOptions([]);
            setSelectedOption(null);

            const response = await api.post(
                "/api/ai/enhance-pro-sum",
                { userContent: data },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            if (
                !response.data.options ||
                response.data.options.length === 0
            ) {
                toast.error("No suggestions were generated. Please try again.");
                return;
            }

            setOptions(response.data.options);
            toast.success("3 summary options generated!");
        } catch (error) {
            console.error("AI Enhancement Error:", error);
            toast.error(
                error?.response?.data?.message || error.message
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const applySelectedSummary = () => {
        if (selectedOption === null) return;

        const selectedSummary = options[selectedOption]?.summary;

        if (!selectedSummary) {
            toast.error("Please select a valid summary.");
            return;
        }

        setresumeData(prev => ({
            ...prev,
            professional_summary: selectedSummary
        }));

        setOptions([]);
        setSelectedOption(null);

        toast.success("Professional summary updated!");
    };

    return (
        <div className="space-y-5">

            {/* Heading and AI Button */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        Professional Summary
                    </h3>

                    <p className="text-sm text-gray-500">
                        Add your professional summary here
                    </p>
                </div>

                <button
                    onClick={generateSummery}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                >
                    {isGenerating ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Sparkle className="size-4" />
                    )}

                    {isGenerating ? "Generating..." : "AI Enhance"}
                </button>
            </div>

            {/* Summary Textarea */}
            <div>
                <textarea
                    value={data || ""}
                    onChange={(e) => onChange(e.target.value)}
                    rows={7}
                    className="w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                    placeholder="Write a professional summary highlighting your key strengths, skills and career objectives..."
                />

                <p className="text-xs text-gray-500 text-center mt-2">
                    Tip: Keep it concise (3-4 sentences) and focus on your
                    relevant skills and achievements.
                </p>
            </div>

            {/* AI Generated Options */}
            {options.length > 0 && (
                <div className="space-y-4">

                    <div>
                        <h3 className="text-base font-semibold text-gray-900">
                            Choose Your Preferred Summary
                        </h3>

                        <p className="text-sm text-gray-500">
                            Select one option and apply it to your resume.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {options.map((option, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setSelectedOption(index)}
                                className={`w-full text-left p-4 rounded-lg border transition-all ${
                                    selectedOption === index
                                        ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200"
                                        : "border-gray-200 bg-white hover:border-purple-300"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-sm text-gray-900">
                                        {option.title}
                                    </span>

                                    {selectedOption === index && (
                                        <Check className="size-5 text-purple-600" />
                                    )}
                                </div>

                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {option.summary}
                                </p>
                            </button>
                        ))}
                    </div>

                    {/* Apply Button */}
                    <button
                        type="button"
                        onClick={applySelectedSummary}
                        disabled={selectedOption === null}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Check className="size-4" />
                        Apply Selected Summary
                    </button>

                </div>
            )}

        </div>
    );
}
