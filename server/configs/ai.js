import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");
const genAI2 = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_2 || apiKey || "");

/**
 * Returns a configured Google Generative AI model instance.
 * @param {Object} options
 * @param {string} [options.model] - Model name override (defaults to env or gemini-3.5-flash)
 * @param {Object} [options.generationConfig] - Optional generation configuration (e.g. responseMimeType)
 * @param {GoogleGenerativeAI} [options.instance] - Optional SDK instance override
 */
export const getGeminiModel = ({
    model = process.env.GEMINI_AI_MODEL || "gemini-3.5-flash",
    generationConfig = {},
    instance = genAI
} = {}) => {
    return instance.getGenerativeModel({
        model,
        generationConfig
    });
};

export { genAI, genAI2 };
export default genAI;
