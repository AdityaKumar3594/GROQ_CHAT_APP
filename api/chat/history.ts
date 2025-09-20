import type { VercelRequest, VercelResponse } from '@vercel/node';

// This would ideally be shared state or database
// For now, we'll redirect to the main chat endpoint
export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // For now, return empty history since we can't share state between functions
    res.json({ history: [] });
  } else if (req.method === 'DELETE') {
    // For now, just return success
    res.json({ message: 'Chat history cleared' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
