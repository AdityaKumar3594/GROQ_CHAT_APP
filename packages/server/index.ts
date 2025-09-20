import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import cors from 'cors';

dotenv.config();

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World');
});

// Simple API endpoint
app.get('/api/hello', (_req: Request, res: Response) => {
  res.json({ message: 'Hello from API' });
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Store chat history
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const chatHistory: ChatMessage[] = [];

// Endpoint to handle chat requests
app.post('/api/chat', async (req: Request, res: Response) => {
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
    const userMessage: ChatMessage = {
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };
    chatHistory.push(userMessage);

    // Prepare messages for API call
    const messages = useHistory
      ? [
          ...chatHistory
            .slice(-10)
            .map((msg) => ({ role: msg.role, content: msg.content })),
        ]
      : [{ role: 'user' as const, content: prompt }];

    const response = await client.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages,
      temperature: 0.1,
      max_tokens: 1000,
      stream: false,
    });

    const assistantMessage =
      response.choices[0]?.message?.content ||
      "I'm sorry, I couldn't generate a response.";

    // Add assistant response to history
    const assistantMsg: ChatMessage = {
      role: 'assistant',
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
});

// Get chat history
app.get('/api/chat/history', (_req: Request, res: Response) => {
  res.json({ history: chatHistory });
});

// Clear chat history
app.delete('/api/chat/history', (_req: Request, res: Response) => {
  chatHistory.length = 0;
  res.json({ message: 'Chat history cleared' });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);

  if (!process.env.GROQ_API_KEY) {
    console.warn(
      '⚠️  Warning: GROQ_API_KEY not found in environment variables'
    );
  }
});
