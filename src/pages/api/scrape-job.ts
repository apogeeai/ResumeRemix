import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = await response.text();
    
    // Extract text content and clean it up
    const text = html
      .replace(/<style[^>]*>[^]*?<\/style>/g, '') // Remove style tags
      .replace(/<script[^>]*>[^]*?<\/script>/g, '') // Remove script tags
      .replace(/<header[^>]*>[^]*?<\/header>/g, '') // Remove header
      .replace(/<footer[^>]*>[^]*?<\/footer>/g, '') // Remove footer
      .replace(/<nav[^>]*>[^]*?<\/nav>/g, '') // Remove navigation
      .replace(/<[^>]+>/g, '\n') // Replace HTML tags with newlines
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with spaces
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();

    // Common job description markers and sections
    const markers = [
      'job description',
      'position description',
      'about the role',
      'about this role',
      'responsibilities',
      'requirements',
      'qualifications',
      'what you\'ll do',
      'the role',
      'overview',
      'about the position',
      'job details',
      'position summary',
      'job summary',
      'essential functions',
      'key responsibilities',
      'duties',
      'about this opportunity',
      'role description'
    ];

    const endMarkers = [
      'how to apply',
      'apply now',
      'benefits',
      'what we offer',
      'about the company',
      'about us',
      'why work with us',
      'salary',
      'compensation'
    ];

    // Try to find the most relevant section
    let startIndex = -1;
    let endIndex = text.length;

    // Find the earliest start marker
    for (const marker of markers) {
      const index = text.toLowerCase().indexOf(marker);
      if (index !== -1 && (startIndex === -1 || index < startIndex)) {
        startIndex = index;
      }
    }

    // Find the earliest end marker after the start marker
    if (startIndex !== -1) {
      for (const marker of endMarkers) {
        const index = text.toLowerCase().indexOf(marker, startIndex + 100); // Add some buffer
        if (index !== -1 && index < endIndex) {
          endIndex = index;
        }
      }
    }

    let jobDescription = startIndex !== -1 
      ? text.slice(startIndex, endIndex).trim()
      : text;

    // Clean up the formatting
    jobDescription = jobDescription
      .replace(/([.!?])\s+/g, '$1\n\n') // Add paragraph breaks after sentences
      .replace(/•/g, '\n•') // Add line breaks before bullets
      .replace(/\n{3,}/g, '\n\n') // Remove excess line breaks
      .trim();

    res.status(200).json({ jobDescription });
  } catch (error: any) {
    console.error("Scraping Error:", error);
    res.status(500).json({
      error: "Failed to scrape job description",
      details: error.message
    });
  }
} 