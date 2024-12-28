
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.Open_API_Key) {
    return res.status(500).json({ 
      error: 'OpenAI API key not configured',
      details: 'Please add your OpenAI API key to the Secrets tool (Tools > Secrets)'
    });
  }

  const openai = new OpenAI({
    apiKey: process.env.Open_API_Key
  });

  try {
    const { resume, jobDescription } = req.body;

    if (!resume || !jobDescription) {
      return res.status(400).json({ error: 'Resume and job description are required' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer specializing in transforming resume bullet points to match job requirements while maintaining original formatting and structure."
        },
        {
          role: "user",
          content: `Transform the candidate's resume bullet points to align with the job requirements. For each bullet point in the original resume, create a corresponding enhanced version that incorporates relevant keywords and requirements from the job description. Maintain the exact same formatting, including:
- Preserve all bullet points and symbols
- Keep line breaks and spacing
- Maintain any existing indentation
- Keep the same number of bullet points as the original resume

Original Resume bullet points should be enhanced to emphasize:
1. Use matching keywords from the job description
2. Highlight relevant skills and achievements
3. Quantify results where possible
4. Match the tone and terminology of the job posting

Key Matching Skills:
• [List 3-5 most relevant skills]

Targeted Experience Highlights:
• [Transform resume experiences into 5-7 achievement-focused bullet points that directly address job requirements]

Technical Proficiencies:
• [List relevant technical skills from resume that match job needs]

Additional Qualifications:
• [2-3 bullet points highlighting other relevant qualifications]

Original Resume: "${resume}"
Job Description: "${jobDescription}"

Instructions:
1. Analyze both the resume and job description for matching keywords and skills
2. Reorganize and rephrase the candidate's experience to highlight relevant qualifications
3. Keep the candidate's actual achievements but align them with job requirements
4. Structure with: Summary, Experience (emphasizing matching skills), Technical Skills, and Education
5. Maintain quantifiable achievements from the original resume`
        }
      ],
    });

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ result: completion.choices[0].message.content });
  } catch (error: any) {
    console.error('OpenAI Error:', error);
    const errorMessage = error.response?.data?.error?.message || error.message || 'Unknown error';
    res.status(500).json({ 
      error: 'Failed to generate resume',
      details: errorMessage
    });
  }
}
