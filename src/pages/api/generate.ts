import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  try {
    const { resume, jobDescription } = req.body;
    if (!resume || !jobDescription) {
      return res
        .status(400)
        .json({ error: "Resume and Job Description are required" });
    }

    // The prompt instructs GPT on exactly what you need
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
          You are an expert resume writer with a PhD-level understanding of how to adapt
          resume bullet points to new job descriptions. You strictly follow user instructions
          about formatting, bullet points, and essential achievements to highlight.
          `,
        },
        {
          role: "user",
          content: `
Transform the candidate's resume bullet points so they reflect the new job requirements while retaining core achievements from the original description. 

**Important Requirements:**
1. **Produce exactly 4 bullet points**—no more, no fewer.
2. Each bullet point should be a concise “hybrid” of the candidate’s original responsibilities and the new job’s requirements/keywords.
3. Preserve crucial achievements, numbers, or specifics from the candidate’s original text.
4. Incorporate relevant skills and keywords from the new job description.
5. The tone should match the target job description while still reflecting the candidate’s background.

**Original Resume**: 
\`\`\`
${resume}
\`\`\`

**Target Job Description**:
\`\`\`
${jobDescription}
\`\`\`

**Instructions**:
- Read the original resume and the target job description carefully.
- Identify the most important achievements, skills, and responsibilities that overlap.
- Combine them into exactly 4 bullet points that each integrate the candidate’s achievements with the new role's requirements.
- Make sure to preserve any quantifiable metrics or unique details from the original.
- Do not add any extra bullet points or sections.

**Deliverable**: 
\`\`\`
• Bullet Point 1
• Bullet Point 2
• Bullet Point 3
• Bullet Point 4
\`\`\`

No additional text beyond these four bullet points is needed.`,
        },
      ],
    });

    res.setHeader("Content-Type", "application/json");
    res
      .status(200)
      .json({ result: completion.data.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Error:", error);
    const errorMessage =
      error.response?.data?.error?.message || error.message || "Unknown error";
    res.status(500).json({
      error: "Failed to generate resume",
      details: errorMessage,
    });
  }
}
