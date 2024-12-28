
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  return res.status(500).json({ 
    error: 'OpenAI API key not configured',
    details: 'Please add your OpenAI API key to the Secrets tool (Tools > Secrets)'
  });
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
          content: "You are a professional resume writer and job description expert."
        },
        {
          role: "user",
          content: `Create a hybrid job description that combines the requirements from this job description: "${jobDescription}" with the qualifications from this resume: "${resume}". Focus on matching skills and creating an ideal position that fits both.`
        }
      ],
    });

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ result: completion.choices[0].message.content });
  } catch (error: any) {
    console.error('OpenAI Error:', error);
    const errorMessage = error.response?.data?.error?.message || error.message || 'Unknown error';
    res.status(500).json({ 
      error: 'Failed to generate description',
      details: errorMessage
    });
  }
}
