
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
          content: "You are an expert resume writer skilled at creating targeted resumes."
        },
        {
          role: "user",
          content: `Create a tailored resume that combines the candidate's experience from this resume: "${resume}" 
                   with the requirements from this job description: "${jobDescription}". 
                   Focus on highlighting relevant skills and experiences that match the job requirements.
                   Format it as a proper resume with sections for Summary, Experience, Skills, and Education if available.`
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
