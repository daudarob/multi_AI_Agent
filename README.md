<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DAMA Multi-Agent AI Platform

A production-grade multi-agent platform for Healthcare, Education, and Finance domains powered by Google Gemini AI.

## 🌟 Features

- **Multi-Domain Support**: Healthcare, Education, and Finance specialized agents
- **Ensemble Intelligence**: Multiple AI agents working together (Supervisor, Specialist, Critic)
- **Real-Time Voice Interaction**: Live voice sessions with transcription
- **Safety Guardrails**: Built-in human-in-the-loop approval for sensitive content
- **Grounded Responses**: Web search integration for verified information
- **Modern UI**: Dark theme with responsive design using Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18.0.0 or higher
- **npm** (comes with Node.js)
- **Google Gemini API Key** from [AI Studio](https://aistudio.google.com/)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Create a `.env` file in the project root
   - Add your Google Gemini API key:
     ```env
     VITE_API_KEY=your_api_key_here
     ```
   - Get your API key at: https://aistudio.google.com/

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:5173](http://localhost:5173)

## 📚 Documentation

- **[Complete Setup Guide](SETUP_GUIDE.md)** - Detailed setup instructions, troubleshooting, and configuration options
- **[Voice Link Guide](VOICE_LINK_GUIDE.md)** - Comprehensive guide for the voice interaction feature

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

## 🏗️ Technology Stack

- **React 19** - UI Framework
- **TypeScript 5** - Type-safe development
- **Vite 6** - Build tool and dev server
- **Tailwind CSS 3** - Utility-first styling
- **Google GenAI SDK** - AI/ML integration
- **Lucide React** - Icon library

## 📁 Project Structure

```
multi/
├── components/          # React components
│   ├── AgentDashboard.tsx
│   └── Sidebar.tsx
├── services/            # External services
│   └── gemini.ts        # Google GenAI integration
├── App.tsx              # Main application component
├── index.tsx            # React entry point
├── types.ts             # TypeScript definitions
├── constants.ts         # Domain and agent configurations
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## 🔐 Security Notes

- Never commit the `.env` file to version control
- Use environment-specific files for different environments
- Rotate API keys regularly
- Monitor API usage in Google Cloud Console

## 📖 Usage

### Text Queries

1. Select a domain (Healthcare, Education, or Finance) from the sidebar
2. Type your query in the input field
3. Press Enter or click the arrow button
4. View the AI-generated response with source citations

### Voice Sessions

1. Click the "Voice Link" button (microphone icon)
2. Grant microphone permission when prompted
3. Speak your query naturally
4. Receive real-time transcription and audio responses

For detailed information about the voice link feature, see the [**Voice Link Guide**](VOICE_LINK_GUIDE.md).

### Agent Dashboard

1. Click the three-dot menu icon in the top-right
2. View the ensemble of agents working together
3. Monitor agent status and workflow progress

## 🐛 Troubleshooting

For common issues and solutions, refer to the [Troubleshooting Section](SETUP_GUIDE.md#troubleshooting) in the Setup Guide.

## 📄 License

This project is part of an academic assignment for APT 3010 C at USIU-Africa.

## 🤝 Contributing

This is an academic project. For questions or issues, please contact the course instructor.

---

**View your app in AI Studio:** https://ai.studio/apps/drive/1WTkb1K2-UVf90ZM437gG9NUWncNjKQqF
