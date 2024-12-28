
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
          content: "You are an expert resume writer specializing in tailoring resumes to specific job requirements while maintaining the candidate's authentic experience."
        },
        {
          role: "user",
          content: `Create a hybrid resume that strategically combines and emphasizes the overlapping elements between the candidate's experience and job requirements.

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
