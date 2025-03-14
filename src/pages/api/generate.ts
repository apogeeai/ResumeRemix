import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// Simple rate limiting
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;
const requestCounts = new Map<string, { count: number; timestamp: number }>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  
  const userRequests = requestCounts.get(ip as string) || { count: 0, timestamp: now };
  if (now - userRequests.timestamp > RATE_LIMIT_WINDOW) {
    userRequests.count = 0;
    userRequests.timestamp = now;
  }
  
  if (userRequests.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }
  
  userRequests.count++;
  requestCounts.set(ip as string, userRequests);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "OpenAI API key not configured",
      details: "Please add your OpenAI API key to the Secrets tool (Tools > Secrets)",
    });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const { resume, jobDescription, type } = req.body;

    if (!resume || !jobDescription) {
      return res
        .status(400)
        .json({ error: "Resume and job description are required" });
    }

    if (!type || !['resume', 'cover-letter'].includes(type)) {
      return res.status(400).json({ error: "Invalid type specified" });
    }

    const systemPrompt = type === 'resume' 
      ? `You are an expert ATS system analyzer and PhD-level recruitment consultant specializing in semantic analysis and keyword optimization. Your task is to perform an in-depth algorithmic analysis of resume-job alignment using advanced NLP techniques, considering both ATS systems and human recruiter psychology.`
      : `You are a professional cover letter writer. Create a concise 150-word cover letter matching the candidate to the role.`;

    const userPrompt = type === 'resume'
      ? `Perform a comprehensive semantic and keyword analysis:

1. ATS Match Score (0-100%)
• Calculate based on weighted criteria:
  - Key technical skills alignment (40%)
  - Experience relevance (30%)
  - Role-specific terminology match (20%)
  - Industry-specific keywords (10%)
• Show subcategory scores and final weighted score

2. Critical Missing Keywords
• High-impact missing terms (ranked by importance)
• Context-specific terminology gaps
• Industry-standard certifications/tools absent
• Semantic alternatives analysis

3. Advanced Skills Analysis
• Priority matrix of missing skills (Essential/Important/Beneficial)
• Semantic clustering of existing skills
• Recommended skill phrasing for maximum ATS impact
• Complementary skills for role advancement

4. Strategic Recommendations
• ATS optimization tactics
• Semantic reinforcement strategies
• Achievement quantification formula
• Position-specific language enhancements

Format with clear hierarchical structure. Focus on actionable, high-impact changes.

Resume: "${resume}"
Job Description: "${jobDescription}"`
      : `Write a 150-word professional cover letter that:
- Shows enthusiasm and relevant experience
- Highlights 2-3 key achievements
- Ends with a call to action
No double spacing between paragraphs.

Resume: "${resume}"
Job Description: "${jobDescription}"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: type === 'resume' ? 0.3 : 0.5,
      max_tokens: type === 'resume' ? 1000 : 500,
    });

    // Format the cover letter for Word document if needed
    let result = completion.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No content generated");
    }
    
    if (type === 'cover-letter') {
      result = result.replace(/\n\n/g, '\n'); // Remove double line breaks
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ result });
  } catch (error: any) {
    console.error("OpenAI Error:", error);
    const errorMessage =
      error.response?.data?.error?.message || error.message || "Unknown error";
    
    // Check for quota exceeded error
    if (errorMessage.includes("exceeded your current quota")) {
      return res.status(500).json({
        error: "API Quota Exceeded",
        details: "The OpenAI API quota has been exceeded. Please check the API key's billing status and ensure there are sufficient credits available."
      });
    }
    
    res.status(500).json({
      error: "Failed to generate content",
      details: errorMessage,
    });
  }
}
