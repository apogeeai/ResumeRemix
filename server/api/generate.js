const openaiApiKey = process.env.Open_API_Key;

if (!openaiApiKey) {
  console.error('The Open_API_Key environment variable is missing or empty.');
  return res.status(500).json({ error: 'Internal server error: Missing API key.' });
}

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: openaiApiKey }); 