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

  if (!process.env.Open_API_Key) {
    return res.status(500).json({
      error: "OpenAI API key not configured",
      details: "Please add your OpenAI API key to the Secrets tool (Tools > Secrets)",
    });
  }

  const openai = new OpenAI({
    apiKey: process.env.Open_API_Key,
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
      ? `You are an expert ATS-optimization specialist and resume writer with experience in talent acquisition across multiple industries. Your expertise includes keyword optimization, achievement quantification, and maintaining authenticity while maximizing match rates.`
      : `You are an expert cover letter writer with extensive experience in talent acquisition. Your task is to create a compelling 150-word cover letter that highlights the candidate's relevant experience and demonstrates their fit for the role. The cover letter should be professional, engaging, and tailored to the specific job description.`;

    const userPrompt = type === 'resume'
      ? `Transform the candidate's latest role's bullet pointed resume items to optimize for both ATS systems and human readers while maintaining professional authenticity. Make sure to output in bullet Points then have a sections says Overview of thigs to change in rest of resume, skills etc) Follow these precise guidelines:

STEP 1: JOB DESCRIPTION ANALYSIS
Extract core technical requirements and skills
Identify key soft skills and leadership requirements
Note specific metrics, tools, and technologies mentioned
Capture industry-specific terminology
Identify required years of experience and responsibility level

STEP 2: CURRENT BULLET POINT ANALYSIS
Review existing achievements and metrics
Identify transferable skills and experiences
Note current action verbs and technical terms
Evaluate existing quantifiable results
Check for leadership and project management elements

STEP 3: OPTIMIZATION RULES
Start each bullet with a strong action verb
Include exact job description keywords where truthful
Quantify achievements with specific metrics
Limit each bullet to 1-2 lines
Use clear technical terminology without acronyms

STEP 4: BULLET POINT TRANSFORMATION
CREATE 5 OPTIMIZED BULLETS THAT:
Lead with high-impact action verbs
Incorporate job-specific keywords naturally
Include measurable results (%, $, time saved)
Demonstrate scope of responsibility
Show technical proficiency required by the role

Original Resume: "${resume}"
Job Description: "${jobDescription}"`
      : `Create a compelling 150-word cover letter based on the candidate's resume and the job description. The cover letter should:
1. Open with a strong introduction that shows enthusiasm for the role
2. Highlight 2-3 most relevant achievements from the resume that match the job requirements
3. Demonstrate understanding of the company's needs
4. Close with a clear call to action
5. Maintain a professional yet engaging tone
6. Be exactly 150 words

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
      temperature: 0.5,
      max_tokens: 2000,
    });

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ result: completion.choices[0].message.content });
  } catch (error: any) {
    console.error("OpenAI Error:", error);
    const errorMessage =
      error.response?.data?.error?.message || error.message || "Unknown error";
    res.status(500).json({
      error: "Failed to generate content",
      details: errorMessage,
    });
  }
}
