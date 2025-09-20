import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Store chat history (in production, you'd use a database)
let chatHistory: Array<{
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}> = [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { prompt, useHistory = false } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Valid prompt is required' });
      }

      if (prompt.length > 4000) {
        return res
          .status(400)
          .json({ error: 'Prompt too long (max 4000 characters)' });
      }

      // Add user message to history
      const userMessage = {
        role: 'user' as const,
        content: prompt,
        timestamp: new Date(),
      };
      chatHistory.push(userMessage);

      // Prepare messages for API call
      const messages = useHistory
        ? chatHistory
            .slice(-10)
            .map((msg) => ({ role: msg.role, content: msg.content }))
        : [{ role: 'user' as const, content: prompt }];

      const response = await client.chat.completions.create({
        model: 'llama3-8b-8192',
        messages,
        temperature: 0.1,
        max_tokens: 1000,
        stream: false,
      });

      const assistantMessage =
        response.choices[0]?.message?.content ||
        "I'm sorry, I couldn't generate a response.";

      // Add assistant response to history
      const assistantMsg = {
        role: 'assistant' as const,
        content: assistantMessage,
        timestamp: new Date(),
      };
      chatHistory.push(assistantMsg);

      res.json({
        message: assistantMessage,
        id: response.id,
        usage: response.usage,
        historyLength: chatHistory.length,
      });
    } catch (error) {
      console.error('Chat error:', error);

      // More specific error handling
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          return res.status(401).json({ error: 'Invalid API key' });
        }
        if (error.message.includes('rate limit')) {
          return res.status(429).json({ error: 'Rate limit exceeded' });
        }
      }

      res.status(500).json({ error: 'Failed to process chat request' });
    }
  } else if (req.method === 'GET') {
    // Get chat history
    res.json({ history: chatHistory });
  } else if (req.method === 'DELETE') {
    // Clear chat history
    chatHistory.length = 0;
    res.json({ message: 'Chat history cleared' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
