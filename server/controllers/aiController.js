import { getGeminiModel } from "../configs/ai.js";
import Resume from "../models/Resume.js";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

/**
 * Helper function to remove markdown code fences from AI responses
 */
const cleanJSON = (text) => {
    if (!text) return "";
    return text
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "")
        .trim();
};

/**
 * Robust error handling helper for Gemini AI errors
 * Formats errors for rate limits (429), temporary server unavailability (503),
 * and invalid/missing API keys (401/403).
 */
export const handleAiError = (error, res, actionName = "AI Enhancement") => {
    console.error(`${actionName} Error:`, error);

    const errorMessage = error?.message || "";
    const status = error?.status || 0;

    // 1. Rate limits (HTTP 429 / RESOURCE_EXHAUSTED / quota)
    if (
        status === 429 ||
        errorMessage.includes("429") ||
        errorMessage.includes("RESOURCE_EXHAUSTED") ||
        errorMessage.toLowerCase().includes("quota") ||
        errorMessage.toLowerCase().includes("rate limit")
    ) {
        return res.status(429).json({
            message: "Gemini AI rate limit reached. Please wait a moment and try again.",
            error: "RATE_LIMIT_EXCEEDED"
        });
    }

    // 2. Temporary Server Errors (HTTP 503 / 500 / 504 / high demand)
    if (
        status === 503 ||
        status === 504 ||
        status === 500 ||
        errorMessage.includes("503") ||
        errorMessage.includes("504") ||
        errorMessage.toLowerCase().includes("high demand") ||
        errorMessage.toLowerCase().includes("temporarily unavailable") ||
        errorMessage.toLowerCase().includes("overloaded") ||
        errorMessage.includes("UNAVAILABLE")
    ) {
        return res.status(503).json({
            message: "Gemini AI service is temporarily experiencing high demand. Please try again in a few moments.",
            error: "SERVICE_TEMPORARILY_UNAVAILABLE"
        });
    }

    // 3. Invalid or unauthorized API key (HTTP 400 / 401 / 403)
    if (
        status === 400 ||
        status === 401 ||
        status === 403 ||
        errorMessage.includes("API_KEY_INVALID") ||
        errorMessage.toLowerCase().includes("api key not valid") ||
        errorMessage.toLowerCase().includes("api key is invalid") ||
        errorMessage.includes("PERMISSION_DENIED")
    ) {
        return res.status(401).json({
            message: "Gemini API key is invalid or unauthorized. Please check server/.env configuration.",
            error: "INVALID_API_KEY"
        });
    }

    // 4. General fallback error
    return res.status(500).json({
        message: `${actionName} failed. Please try again.`,
        details: errorMessage
    });
};

/**
 * Execute Gemini generation with automatic fallback to supported lightweight models
 * if the primary model encounters a temporary 503 high demand spike.
 */
const generateWithGemini = async ({ prompt, isJson = false, systemInstruction = "" }) => {
    const configuredModel = process.env.GEMINI_AI_MODEL || "gemini-3.5-flash";
    const modelsToTry = [
        configuredModel,
        "gemini-3.5-flash",
        "gemini-flash-lite-latest",
        "gemini-3.5-flash-lite"
    ].filter((m, idx, arr) => m && arr.indexOf(m) === idx);

    let lastError = null;

    for (let i = 0; i < modelsToTry.length; i++) {
        const modelName = modelsToTry[i];
        try {
            const generationConfig = isJson
                ? { responseMimeType: "application/json" }
                : {};

            const modelOptions = {
                model: modelName,
                generationConfig
            };

            if (systemInstruction) {
                modelOptions.systemInstruction = systemInstruction;
            }

            const model = getGeminiModel(modelOptions);
            const result = await model.generateContent(prompt);
            return result.response.text().trim();
        } catch (error) {
            lastError = error;
            const msg = error?.message || "";
            const isTemporaryDemandSpike =
                error?.status === 503 ||
                error?.status === 500 ||
                error?.status === 504 ||
                msg.includes("503") ||
                msg.toLowerCase().includes("high demand") ||
                msg.toLowerCase().includes("unavailable");

            if (isTemporaryDemandSpike && i < modelsToTry.length - 1) {
                console.warn(`Model ${modelName} high demand spike. Retrying with fallback model ${modelsToTry[i + 1]}...`);
                continue;
            }

            throw error;
        }
    }

    throw lastError;
};

/**
 * Controller for enhancing professional summary
 * POST: /api/ai/enhance-pro-sum
 * Returns exactly 3 ATS-friendly options: Professional, Concise, ATS-Friendly
 */
export const enhanceProfessionalSummary = async (req, res) => {
    const { userContent } = req.body;

    if (!userContent || !userContent.trim()) {
        return res.status(400).json({
            message: "Please enter your professional summary first."
        });
    }

    const prompt = `You are a professional resume writer. Rewrite the professional summary below into exactly THREE distinct versions.

Original summary:
${userContent.trim()}

RULES — follow exactly:
- Each version must be 2–3 sentences. No more, no less.
- Preserve ONLY the facts and experience stated in the original. Do NOT invent qualifications, roles, or achievements.
- Do NOT include introductions like "Here are...", "Sure!", or any commentary before or after the JSON.
- Do NOT use markdown, bullet symbols, or headers inside the summary text.
- Output ONLY the JSON object below, with no extra text, whitespace, or explanation.

Required output format (valid JSON only):
{
    "options": [
        {
            "title": "Professional",
            "summary": "A polished, formal 2-3 sentence version."
        },
        {
            "title": "Concise",
            "summary": "A short, punchy, high-impact 2-3 sentence version."
        },
        {
            "title": "ATS-Friendly",
            "summary": "A 2-3 sentence version that naturally weaves in relevant keywords for applicant tracking systems."
        }
    ]
}`;

    try {
        const rawResponse = await generateWithGemini({
            prompt,
            isJson: true
        });

        const cleaned = cleanJSON(rawResponse);
        const parsedResult = JSON.parse(cleaned);

        if (!Array.isArray(parsedResult.options) || parsedResult.options.length !== 3) {
            // If the model returned options with different count, normalize or format
            if (Array.isArray(parsedResult.options) && parsedResult.options.length > 0) {
                const titles = ["Professional", "Concise", "ATS-Friendly"];
                const normalized = titles.map((title, idx) => {
                    const existing = parsedResult.options[idx];
                    return {
                        title,
                        summary: existing?.summary || existing?.text || existing?.content || userContent.trim()
                    };
                });
                return res.status(200).json({ options: normalized });
            }
            throw new Error("Gemini returned invalid summary options structure.");
        }

        return res.status(200).json({
            options: parsedResult.options
        });

    } catch (error) {
        return handleAiError(error, res, "Enhance Professional Summary");
    }
};

/**
 * Controller for enhancing Job Description
 * POST: /api/ai/enhance-job-desc
 */
export const enhanceJobDescription = async (req, res) => {
    try {
        // Accept either structured fields or legacy userContent
        const { description, position, company, userContent } = req.body;

        // Determine what text to enhance
        const rawDescription = description || userContent || "";

        if (!rawDescription.trim()) {
            return res.status(400).json({
                message: "Please add a job description before enhancing."
            });
        }

        // Build structured context if structured fields were provided
        const contextLines = [];
        if (position) contextLines.push(`Role: ${position}`);
        if (company) contextLines.push(`Company: ${company}`);
        const context = contextLines.length > 0 ? contextLines.join("\n") + "\n\n" : "";

        const prompt = `You are a professional resume writer. Your task is to rewrite the job description below.

${context}Original job description:
${rawDescription.trim()}

INSTRUCTIONS — follow exactly:
- Rewrite the description using strong, specific action verbs (e.g. "Engineered", "Architected", "Spearheaded").
- Make it ATS-friendly with relevant technical keywords based on the role.
- Keep the same factual content. Do NOT add qualifications, metrics, or achievements the user did not mention.
- Write in past tense (or present tense if the role is current) using concise bullet points or short paragraphs, matching the input style.
- Do NOT include introductions like "Here is..." or "I've enhanced..." or any commentary.
- Do NOT include markdown headers or formatting symbols.
- Do NOT ask follow-up questions.
- Output ONLY the enhanced description text, nothing else.`;

        const rawEnhanced = await generateWithGemini({
            prompt,
            isJson: false
        });

        // Strip any conversational preamble lines Gemini may still produce
        // e.g. "Here is the enhanced description:", "Sure! Here's...", etc.
        const stripPreamble = (text) => {
            const preamblePatterns = [
                /^(here is|here's|here are|sure[,!]?|certainly[,!]?|of course[,!]?|absolutely[,!]?|i['']ve enhanced|i['']ve rewritten|below is|the enhanced|the improved)[^\n]*/i
            ];
            const lines = text.split("\n");
            let startIndex = 0;
            for (let i = 0; i < Math.min(lines.length, 3); i++) {
                const line = lines[i].trim();
                if (line && preamblePatterns.some(p => p.test(line))) {
                    startIndex = i + 1;
                }
            }
            return lines.slice(startIndex).join("\n").trim();
        };

        const enhancedText = stripPreamble(rawEnhanced);

        return res.status(200).json({
            enhancedContent: enhancedText
        });

    } catch (error) {
        return handleAiError(error, res, "Enhance Job Description");
    }
};

/**
 * Controller for extracting data from resume text and saving to DB
 * POST: /api/ai/upload-resume
 */
export const uploadResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body;
        const userId = req.userId;

        if (!resumeText || !resumeText.trim()) {
            return res.status(400).json({
                message: "Missing required field: resumeText"
            });
        }

        const prompt = `
You are an expert AI agent specializing in resume parsing.

Extract data from the following resume text and format it into the specified JSON structure.

Resume text:
${resumeText.trim()}

Return the data in the following JSON format ONLY:
{
    "professional_summary": "...",
    "skills": ["skill1", "skill2"],
    "personal_info": {
        "image": "",
        "full_name": "...",
        "profession": "...",
        "email": "...",
        "phone": "...",
        "location": "...",
        "linkedin": "...",
        "website": "..."
    },
    "experience": [
        {
            "company": "...",
            "position": "...",
            "start_date": "...",
            "end_date": "...",
            "description": "...",
            "is_current": false
        }
    ],
    "projects": [
        {
            "name": "...",
            "type": "...",
            "description": "..."
        }
    ],
    "education": [
        {
            "institution": "...",
            "degree": "...",
            "field": "...",
            "graduation_date": "...",
            "gpa": "..."
        }
    ]
}
`;

        const rawResponse = await generateWithGemini({
            prompt,
            isJson: true
        });

        const cleaned = cleanJSON(rawResponse);
        const parsedData = JSON.parse(cleaned);

        const newResume = await Resume.create({
            userId,
            title: title || "Uploaded Resume",
            ...parsedData
        });

        return res.status(200).json({ resumeId: newResume._id });

    } catch (error) {
        return handleAiError(error, res, "Upload Resume");
    }
};

/**
 * Controller for extracting text from resume file (PDF or DOCX)
 * POST: /api/ai/analyze-resume-file
 */
export const analyzeResumeFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        const fileBuffer = req.file.buffer;
        let text = "";

        if (req.file.mimetype === "application/pdf") {
            const uint8Array = new Uint8Array(fileBuffer);
            const parser = new PDFParse(uint8Array);
            const result = await parser.getText();
            text = result.text;

        } else if (
            req.file.mimetype ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            const result = await mammoth.extractRawText({
                buffer: fileBuffer
            });

            text = result.value;

        } else {
            return res.status(400).json({
                message: "Unsupported file type. Please upload PDF or DOCX."
            });
        }

        if (!text || text.trim().length === 0) {
            return res.status(400).json({
                message: "Could not extract text from the file."
            });
        }

        return res.status(200).json({ resumeText: text });

    } catch (error) {
        console.error("Error in analyzeResumeFile:", error);
        return res.status(500).json({
            message: error.message
        });
    }
};

/**
 * Controller for generating AI questions based on resume
 * POST: /api/ai/generate-questions
 */
export const generateQuestions = async (req, res) => {
    try {
        const { resumeText } = req.body;

        if (!resumeText || !resumeText.trim()) {
            return res.status(400).json({
                message: "Missing resume text"
            });
        }

        const prompt = `You are an expert career coach and technical interviewer.
From the given resume text, generate 5 to 7 insightful, relevant interview questions.
Return ONLY a JSON object in this format: {"questions": ["q1", "q2", ...]}.

Resume:
${resumeText.trim()}`;

        const rawResponse = await generateWithGemini({
            prompt,
            isJson: true
        });

        const cleaned = cleanJSON(rawResponse);
        const parsed = JSON.parse(cleaned);

        let questions = parsed.questions || parsed.interview_questions;

        if (!Array.isArray(questions) || questions.length === 0) {
            questions = [
                "What are your key professional strengths?",
                "Where do you see yourself in 5 years?",
                "Tell me about a challenge you faced at work.",
                "Why are you interested in this role?",
                "What makes you a good fit for this position?"
            ];
        }

        return res.status(200).json({ questions });

    } catch (error) {
        return handleAiError(error, res, "Generate Interview Questions");
    }
};

/**
 * Controller for final resume analysis
 * POST: /api/ai/final-analysis
 */
export const getFinalAnalysis = async (req, res) => {
    try {
        const { resumeText, answers } = req.body;

        if (!resumeText || !answers) {
            return res.status(400).json({
                message: "Missing required fields: resumeText and answers"
            });
        }

        const prompt = `You are a career expert and hiring manager.
Based on the resume and user answers, provide a comprehensive career readiness analysis.

Resume:
${resumeText.trim()}

Answers:
${typeof answers === "string" ? answers : JSON.stringify(answers, null, 2)}

Return ONLY valid JSON matching this exact structure:
{
  "Relevant Skills": ["skill1", "skill2"],
  "Missing Skills": ["skill1", "skill2"],
  "Resume Strengths": "A concise paragraph summarizing the candidate's key strengths...",
  "Weak Points": "A concise paragraph highlighting areas that need improvement...",
  "Actionable Suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}`;

        const rawResponse = await generateWithGemini({
            prompt,
            isJson: true
        });

        const cleaned = cleanJSON(rawResponse);
        const analysis = JSON.parse(cleaned);

        const normalizedAnalysis = {
            "Relevant Skills":
                analysis["Relevant Skills"] ||
                analysis["relevant_skills"] || [],

            "Missing Skills":
                analysis["Missing Skills"] ||
                analysis["missing_skills"] || [],

            "Resume Strengths":
                analysis["Resume Strengths"] ||
                analysis["resume_strengths"] || "",

            "Weak Points":
                analysis["Weak Points"] ||
                analysis["weak_points"] || "",

            "Actionable Suggestions":
                analysis["Actionable Suggestions"] ||
                analysis["actionable_suggestions"] || []
        };

        return res.status(200).json({
            analysis: normalizedAnalysis
        });

    } catch (error) {
        return handleAiError(error, res, "Resume Final Analysis");
    }
};
