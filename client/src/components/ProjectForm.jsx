
import { Plus, Trash2, FolderIcon, Sparkles, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useState } from "react";
import api from "../configs/api";
import toast from "react-hot-toast";

export default function ProjectForm({ data, onChange }) {

    const { token } = useSelector(state => state.auth);
    const [generatingIndex, setGeneratingIndex] = useState(null);

    const addProject = () => {
        const newProject = {
            name: "",
            type: "",
            description: ""
        };

        onChange([...(data || []), newProject]);
    };

    const removeProject = (index) => {
        const updated = (data || []).filter((_, i) => i !== index);
        onChange(updated);
    };

    const updateProject = (index, field, value) => {
        const updated = [...(data || [])];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    // AI Enhance Project Description
    const enhanceProject = async (index) => {

        const description = data[index]?.description;

        if (!description || !description.trim()) {
            toast.error("Please write a project description first.");
            return;
        }

        try {
            setGeneratingIndex(index);

            const response = await api.post(
                "/api/ai/enhance-job-desc",
                { userContent: description },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            const enhancedText = response.data.enhancedContent;

            if (!enhancedText) {
                toast.error("No enhanced description received.");
                return;
            }

            updateProject(index, "description", enhancedText);

            toast.success("Project description enhanced!");

        } catch (error) {
            console.error("Project Enhancement Error:", error);

            toast.error(
                error?.response?.data?.message || error.message
            );

        } finally {
            setGeneratingIndex(null);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        Projects
                    </h3>
                    <p className="text-sm text-gray-500">
                        Add your projects here
                    </p>
                </div>

                <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    onClick={addProject}
                >
                    <Plus className="size-4" />
                    Add Project
                </button>
            </div>

            {!data || data.length === 0 ? (
                <div className="text-center py-8 text-gray-500 mt-6">
                    <FolderIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No projects added yet.</p>
                    <p className="text-sm">
                        Click "Add Project" to get started.
                    </p>
                </div>
            ) : (
                <div className="space-y-4 mt-6">
                    {data.map((project, index) => (
                        <div
                            key={index}
                            className="p-4 border border-gray-200 rounded-lg space-y-3"
                        >
                            <div className="flex justify-between items-start">
                                <h4>Project #{index + 1}</h4>

                                <button
                                    type="button"
                                    onClick={() => removeProject(index)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>

                            <div className="grid gap-3">

                                <input
                                    value={project.name || ""}
                                    onChange={(e) =>
                                        updateProject(index, "name", e.target.value)
                                    }
                                    type="text"
                                    placeholder="Project Name"
                                    className="px-3 py-2 text-sm rounded-lg border border-gray-300"
                                />

                                <input
                                    value={project.type || ""}
                                    onChange={(e) =>
                                        updateProject(index, "type", e.target.value)
                                    }
                                    type="text"
                                    placeholder="Project Type"
                                    className="px-3 py-2 text-sm rounded-lg border border-gray-300"
                                />

                                <textarea
                                    rows={4}
                                    value={project.description || ""}
                                    onChange={(e) =>
                                        updateProject(index, "description", e.target.value)
                                    }
                                    placeholder="Project Description"
                                    className="px-3 py-2 text-sm rounded-lg border border-gray-300"
                                />

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => enhanceProject(index)}
                                        disabled={generatingIndex !== null}
                                        className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                                    >
                                        {generatingIndex === index ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <Sparkles className="size-4" />
                                        )}

                                        {generatingIndex === index
                                            ? "Enhancing..."
                                            : "AI Enhance"}
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
