# Chat App with Groq AI

A modern full-stack chat application powered by Groq's LLM API, built with React, Express, and Bun.

## Features

- 🤖 **AI-Powered Chat**: Integrated with Groq's Llama 3 model
- 💬 **Real-time Messaging**: Instant responses with loading states
- 📱 **Modern UI**: Clean, responsive design with Tailwind CSS
- 🔄 **Chat History**: Persistent conversation history with context
- 🚀 **Fast Development**: Bun runtime for lightning-fast builds
- 🎨 **Beautiful Components**: Shadcn/ui components with animations

## Tech Stack

### Backend
- **Runtime**: Bun
- **Framework**: Express.js
- **AI**: Groq SDK (openai/gpt-oss-120b)
- **Language**: TypeScript

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React

## Quick Start

1. **Clone and install dependencies**:
   ```bash
   bun install
   ```

2. **Set up environment variables**:
   ```bash
   cp packages/server/.env.example packages/server/.env
   ```
   Add your Groq API key to `packages/server/.env`:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   PORT=3000
   ```

3. **Start development servers**:
   ```bash
   bun run dev
   ```

This will start both the server (port 3000) and client (port 5173) concurrently.

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/chat` - Send chat message
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/history` - Clear chat history

## Project Structure

```
├── packages/
│   ├── client/          # React frontend
│   │   ├── src/
│   │   │   ├── components/ui/  # Reusable UI components
│   │   │   ├── lib/           # Utilities
│   │   │   └── App.tsx        # Main app component
│   │   └── vite.config.ts     # Vite configuration
│   └── server/          # Express backend
│       ├── index.ts     # Server entry point
│       └── .env         # Environment variables
├── index.ts            # Development runner
└── package.json        # Root package configuration
```

## Development

- **Server only**: `cd packages/server && bun run dev`
- **Client only**: `cd packages/client && bun run dev`
- **Both (recommended)**: `bun run dev` from root

## Environment Variables

Create `packages/server/.env` with:

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3000
```

Get your Groq API key from [Groq Console](https://console.groq.com/).

## Features in Detail

### Chat Interface
- Clean, modern chat UI with user/assistant message bubbles
- Real-time typing indicators
- Message timestamps
- Auto-scroll to latest messages

### AI Integration
- Groq's Llama 3 model for intelligent responses
- Configurable temperature and token limits
- Context-aware conversations with history
- Error handling for API failures

### Development Experience
- Hot reload for both frontend and backend
- TypeScript throughout for type safety
- Concurrent development with single command
- Proxy setup for seamless API calls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.