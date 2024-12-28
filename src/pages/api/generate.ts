
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
          content: "You are an expert resume writer specializing in creating targeted bullet points that highlight relevant experience for specific job requirements."
        },
        {
          role: "user",
          content: `Analyze the resume and job description, then create a bulleted list of achievements and experiences that best match the job requirements. Format the response as follows:

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
