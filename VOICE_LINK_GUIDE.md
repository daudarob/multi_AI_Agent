# Voice Link Feature Guide

## 🎤 Overview

The Voice Link feature enables real-time voice interaction with the DAMA Multi-Agent AI Platform. It uses the Google Gemini Live API to provide bidirectional audio streaming with automatic transcription.

## ✨ Features

- **Real-time Voice Interaction**: Speak naturally and receive audio responses
- **Automatic Transcription**: See both your speech and AI responses as text
- **Multi-Domain Support**: Works with Healthcare, Education, and Finance domains
- **Connection Status Indicators**: Visual feedback for connection state
- **Error Handling**: User-friendly error messages and recovery options
- **Audio Quality**: Echo cancellation, noise suppression, and auto-gain control

## 🚀 Getting Started

### Prerequisites

1. **Valid API Key**: Ensure your `VITE_API_KEY` is set in [`.env`](.env:1) or [`.env.local`](.env.local:1)
2. **Microphone Access**: Allow microphone permissions when prompted
3. **Supported Browser**: Chrome, Edge, or Firefox (Chrome recommended)
4. **HTTPS or Localhost**: Required for microphone access (browsers block microphone on HTTP)

### Using Voice Link

1. **Start a Session**:
   - Click the "Voice Link" button (microphone icon) in the top-right header
   - Grant microphone permission when prompted
   - Wait for the connection to establish (status will show "Connecting..." then "Live Session")

2. **Speak Your Query**:
   - Speak clearly into your microphone
   - Your speech will be transcribed in real-time
   - The AI will respond with both audio and text

3. **End the Session**:
   - Click the "End Session" button (phone icon)
   - The connection will be closed and resources cleaned up

## 🔧 Connection States

| State | Icon | Description |
|-------|------|-------------|
| **Disconnected** | - | Voice link is not active |
| **Connecting** | 🔄 | Establishing connection to Gemini API |
| **Connected** | ● | Live session active, ready for voice interaction |
| **Error** | ⚠️ | Connection failed, see error message |

## 🎨 UI Elements

### Status Badge
Located in the header next to the domain title, shows the current connection state with color coding:
- **Amber/Yellow**: Connecting
- **Green**: Connected
- **Red**: Error
- **Blue**: Disconnected (default)

### Voice Link Button
Located in the top-right header:
- **Green microphone**: Start voice session
- **Red phone**: End voice session
- **Amber spinner**: Connecting (button disabled)
- **Red warning**: Retry after error

### Error Banner
Appears when connection fails:
- Shows detailed error message
- Dismissible with X button
- Provides actionable information

## 🐛 Troubleshooting

### Issue: "Microphone access denied"

**Cause**: Browser blocked microphone access

**Solutions**:
1. Click the lock icon in the browser address bar
2. Find "Microphone" in the permissions list
3. Change to "Allow"
4. Refresh the page and try again

### Issue: "Invalid API key"

**Cause**: API key is missing or incorrect

**Solutions**:
1. Check that [`.env`](.env:1) or [`.env.local`](.env.local:1) exists
2. Verify the variable name is `VITE_API_KEY` (not `API_KEY`)
3. Ensure the key starts with `AIza...`
4. Get a new key at: https://aistudio.google.com/
5. Restart the dev server after updating the key

### Issue: "API quota exceeded"

**Cause**: Reached Google Gemini API usage limits

**Solutions**:
1. Check your usage at: https://console.cloud.google.com/
2. Wait for quota to reset (usually daily)
3. Upgrade your API plan if needed

### Issue: "Network error"

**Cause**: Internet connection or firewall issues

**Solutions**:
1. Check your internet connection
2. Disable VPN or proxy temporarily
3. Check firewall settings (allow `generativelanguage.googleapis.com`)
4. Try a different network

### Issue: "Failed to initialize audio contexts"

**Cause**: Browser doesn't support Web Audio API or audio hardware issue

**Solutions**:
1. Update your browser to the latest version
2. Check that your microphone is working in other applications
3. Try a different browser (Chrome recommended)
4. Restart your computer

### Issue: No audio output

**Cause**: Audio playback issue

**Solutions**:
1. Check system volume is not muted
2. Verify browser audio is not muted
3. Check browser audio output device settings
4. Try headphones instead of speakers

### Issue: Echo or feedback

**Cause**: Audio from speakers picked up by microphone

**Solutions**:
1. Use headphones instead of speakers
2. Move microphone away from speakers
3. Reduce speaker volume
4. Enable echo cancellation in browser settings

## 🔒 Security & Privacy

### Data Privacy

- **Audio Processing**: Audio is processed by Google's servers
- **Transcription**: Speech is transcribed and displayed
- **No Local Storage**: Audio is not stored locally
- **Session-Based**: Data is only processed during active session

### Best Practices

1. **Secure Environment**: Use in a private setting
2. **Sensitive Information**: Avoid sharing personal or confidential data
3. **Session Management**: Always end sessions when done
4. **API Key Security**: Never commit `.env` files to version control

## 📊 Technical Details

### Architecture

```
User Microphone
    ↓
AudioContext (16kHz)
    ↓
PCM Encoding (Int16)
    ↓
WebSocket (Gemini Live API)
    ↓
AI Processing
    ↓
Audio Response (24kHz)
    ↓
AudioContext Playback
    ↓
Speakers/Headphones
```

### Audio Specifications

| Parameter | Input | Output |
|-----------|-------|--------|
| **Sample Rate** | 16,000 Hz | 24,000 Hz |
| **Channels** | 1 (Mono) | 1 (Mono) |
| **Encoding** | PCM Int16 | PCM Int16 |
| **Format** | Base64 | Base64 |

### Browser Requirements

- **Web Audio API**: Required for audio processing
- **MediaDevices API**: Required for microphone access
- **WebSocket**: Required for real-time communication
- **Promise Support**: Required for async operations

### Supported Browsers

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |
| Firefox | 88+ | ⚠️ Partial Support |
| Safari | 15+ | ⚠️ Partial Support |

## 🎯 Usage Tips

### Best Practices

1. **Clear Speech**: Speak clearly and at a moderate pace
2. **Quiet Environment**: Minimize background noise
3. **Good Microphone**: Use a quality microphone if possible
4. **Headphones**: Recommended to avoid echo
5. **Stable Connection**: Ensure good internet connectivity

### Effective Queries

- **Be Specific**: "What are the symptoms of flu?" vs "Tell me about flu"
- **One Question**: Ask one question at a time
- **Context**: Provide relevant context if needed
- **Domain Selection**: Choose the appropriate domain for your query

### Domain-Specific Tips

**Healthcare**:
- Ask about symptoms, conditions, treatments
- Request general medical information
- Note: Not for emergencies or diagnosis

**Education**:
- Ask for explanations of concepts
- Request learning resources
- Get help with homework or study topics

**Finance**:
- Ask about financial concepts
- Request budgeting advice
- Get general financial information

## 🔄 Session Lifecycle

```
1. User clicks "Voice Link"
   ↓
2. Request microphone permission
   ↓
3. Initialize AudioContexts
   ↓
4. Connect to Gemini Live API
   ↓
5. Status: "Connecting..."
   ↓
6. WebSocket connection established
   ↓
7. Status: "Connected" (Live Session)
   ↓
8. Audio streaming active
   ↓
9. User speaks → Transcription → AI response
   ↓
10. User clicks "End Session"
    ↓
11. Cleanup resources
    ↓
12. Status: "Disconnected"
```

## 🛠️ Development Notes

### Key Files

- [`services/gemini.ts`](services/gemini.ts:216) - Voice session implementation
- [`App.tsx`](App.tsx:78) - Voice link UI and state management
- [`types.ts`](types.ts:48) - Type definitions

### Important Functions

- `connectLiveSession()` - Establishes voice connection
- `toggleLiveSession()` - Starts/stops voice session
- `cleanup()` - Properly disposes all resources

### Error Handling

The implementation includes comprehensive error handling:
- API key validation
- Microphone permission errors
- Network errors
- Audio context errors
- Connection failures

### Resource Cleanup

All resources are properly cleaned up when ending a session:
- Media stream tracks stopped
- Audio contexts closed
- WebSocket connection closed
- Audio sources stopped
- Event listeners removed

## 📝 API Reference

### connectLiveSession()

```typescript
async function connectLiveSession(
  domain: Domain,
  callbacks: {
    onTranscription?: (text: string, role: 'user' | 'model') => void;
    onError?: (err: any) => void;
    onClose?: () => void;
    onStatusChange?: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
  }
): Promise<{
  stop: () => Promise<void>;
  isConnected: () => boolean;
}>
```

**Parameters**:
- `domain`: The AI domain (HEALTHCARE, EDUCATION, FINANCE)
- `callbacks`: Event handlers for session events

**Returns**: Promise resolving to session control object

**Throws**: Error if connection fails

## 🎓 Learning Resources

- [Google Gemini Live API Documentation](https://ai.google.dev/gemini-api/docs/live-api)
- [Web Audio API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [MediaDevices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## 📞 Support

If you encounter issues not covered in this guide:

1. Check the browser console for error messages (F12)
2. Review the terminal output for server errors
3. Verify all prerequisites are met
4. Check the [SETUP_GUIDE.md](SETUP_GUIDE.md:1) for general setup issues

---

**Last Updated**: 2026-02-02
**Version**: 1.0.0