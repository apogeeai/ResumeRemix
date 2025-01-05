import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.Open_API_Key) {
    return res.status(500).json({
      error: "OpenAI API key not configured",
      details:
        "Please add your OpenAI API key to the Secrets tool (Tools > Secrets)",
    });
  }

  const openai = new OpenAI({
    apiKey: process.env.Open_API_Key,
  });

  try {
    const { resume, jobDescription } = req.body;

    if (!resume || !jobDescription) {
      return res
        .status(400)
        .json({ error: "Resume and job description are required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert ATS-optimization specialist and resume writer with experience in talent acquisition across multiple industries. Your expertise includes keyword optimization, achievement quantification, and maintaining authenticity while maximizing match rates.`,
        },
        {
          role: "user",
          content: `Transform the candidate's latest role's bullet pointed resume items to optimize for both ATS systems and human readers while maintaining professional authenticity. Make sure to output in bullet Points then have a sections says Overview of thigs to change in rest of resume, skills etc) Follow these precise guidelines:

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

QUALITY CHECKLIST:
✓ Each bullet starts with a strong action verb
✓ Contains at least one quantifiable metric
✓ Includes key technical terms from job description
✓ Demonstrates relevant skill application
✓ Reads naturally while maintaining ATS optimization
✓ Stays truthful to original experience
OUTPUT FORMAT:

[Action Verb] [Technical Skill/Tool] to [Achievement] resulting in [Quantifiable Impact]

This refined version:

Focuses specifically on bullet point optimization
Provides a clear, step-by-step transformation process
Emphasizes both ATS and human readability
Maintains truthfulness to original experience
Produces consistent, measurable results
Limits output to 5 most impactful bullets

Original Resume: "${resume}"
Job Description: "${jobDescription}"`,
        },
      ],
      temperature: 0.5, // Lower temperature for more consistent output
      max_tokens: 2000, // Adjusted for comprehensive response
    });

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ result: completion.choices[0].message.content });
  } catch (error: any) {
    console.error("OpenAI Error:", error);
    const errorMessage =
      error.response?.data?.error?.message || error.message || "Unknown error";
    res.status(500).json({
      error: "Failed to generate resume",
      details: errorMessage,
    });
  }
}
