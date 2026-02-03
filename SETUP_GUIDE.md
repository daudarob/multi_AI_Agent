# DAMA Multi-Agent Platform - Complete Setup Guide

## 📋 Table of Contents

1. [Technology Stack Overview](#technology-stack-overview)
2. [Prerequisites](#prerequisites)
3. [Installation Steps](#installation-steps)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)
6. [Verification Steps](#verification-steps)
7. [Troubleshooting](#troubleshooting)

---

## 🛠️ Technology Stack Overview

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | ^19.0.0 | UI Framework |
| **TypeScript** | ^5.0.0 | Type-safe JavaScript |
| **Vite** | ^6.0.0 | Build tool & dev server |
| **Tailwind CSS** | ^3.4.4 | Utility-first CSS framework |
| **Google GenAI SDK** | ^1.39.0 | AI/ML integration |
| **Lucide React** | ^0.400.0 | Icon library |

### Build Tools

- **@vitejs/plugin-react** (^4.3.0) - React plugin for Vite
- **PostCSS** (^8.4.38) - CSS processing
- **Autoprefixer** (^10.4.19) - CSS vendor prefixing

### Type Definitions

- **@types/react** (^19.0.0)
- **@types/react-dom** (^19.0.0)

---

## 📦 Prerequisites

### Required Software

1. **Node.js** (v18.0.0 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`
   - Should output: `v18.x.x` or higher

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`
   - Should output: `9.x.x` or higher

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

### Browser Requirements

- **Chrome/Edge** (recommended) - Full feature support including Web Speech API
- **Firefox** - Supported with some limitations
- **Safari** - Supported with some limitations

---

## 🚀 Installation Steps

### Step 1: Navigate to Project Directory

Open your terminal/command prompt and navigate to the project folder:

```bash
cd "c:/Users/Admin/OneDrive - United States International University (USIU)/Desktop/USIU-AFRICA 2024/Year 2/year 2 semester 2/APT 3010 C/assignment/multi"
```

### Step 2: Install Dependencies

Run the following command to install all required packages:

```bash
npm install
```

**What this does:**
- Downloads all packages listed in [`package.json`](package.json:1)
- Creates a `node_modules` folder with all dependencies
- Generates a `package-lock.json` file for reproducible builds

**Expected output:**
```
added 123 packages, and audited 124 packages in 15s
found 0 vulnerabilities
```

### Step 3: Verify Installation

Check that all dependencies are installed correctly:

```bash
npm list --depth=0
```

You should see all packages listed in [`package.json`](package.json:1).

---

## 🔐 Environment Configuration

### Step 1: Get Google Gemini API Key

1. Visit: https://aistudio.google.com/
2. Sign in with your Google account
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the API key (starts with `AIza...`)

### Step 2: Create Environment File

Create a `.env` file in the project root (same directory as [`package.json`](package.json:1)):

```bash
# Windows (Command Prompt)
type nul > .env

# Windows (PowerShell)
New-Item -Path . -Name ".env" -ItemType File

# Or manually create the file using your text editor
```

### Step 3: Add API Key to .env File

Open the `.env` file and add your API key:

```env
# Google Gemini API Key
# Get one at https://aistudio.google.com/
VITE_API_KEY=AIzaSyYourActualApiKeyHere
```

**⚠️ IMPORTANT NOTES:**
- The variable **MUST** start with `VITE_` prefix for Vite to expose it to the client
- Replace `AIzaSyYourActualApiKeyHere` with your actual API key
- Never commit `.env` to version control (it's in [`.gitignore`](.gitignore:1))
- Use [`.env.example`](.env.example:1) as a template

### Step 4: Verify Environment Configuration

The application uses [`vite-env.d.ts`](vite-env.d.ts:1) for TypeScript type definitions:

```typescript
interface ImportMetaEnv {
  readonly VITE_API_KEY: string
}
```

This ensures TypeScript recognizes `import.meta.env.VITE_API_KEY` throughout the codebase.

---

## 🏃 Running the Application

### Option 1: Development Mode (Recommended)

Start the development server with hot module replacement:

```bash
npm run dev
```

**Expected output:**
```
  VITE v6.0.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Features in dev mode:**
- Hot Module Replacement (HMR) - changes reflect instantly
- Fast refresh without full page reload
- Source maps for debugging
- Detailed error messages

### Option 2: Production Build

Build the application for production:

```bash
npm run build
```

**What this does:**
- Runs TypeScript compiler (`tsc`) for type checking
- Bundles and minifies code with Vite
- Optimizes assets (CSS, JS, images)
- Creates a `dist/` folder with production-ready files

**Expected output:**
```
> dama-multi-agent-platform@1.0.0 build
> tsc && vite build

vite v6.0.0 building for production...
✓ 45 modules transformed.
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-abc123.js      145.23 kB │ gzip: 45.67 kB
dist/assets/index-def456.css     12.34 kB │ gzip:  4.56 kB
```

Preview the production build:

```bash
npm run preview
```

This serves the production build locally for testing.

---

## ✅ Verification Steps

### Step 1: Check Server is Running

Open your browser and navigate to:

```
http://localhost:5173
```

**Expected behavior:**
- Page loads without errors
- You see the DAMA Multi-Agent AI interface
- Dark theme with sidebar navigation
- Three domain tabs: Healthcare, Education, Finance

### Step 2: Verify Browser Console

1. Open Developer Tools (F12 or Ctrl+Shift+I)
2. Go to the **Console** tab
3. Check for any red error messages

**Expected:**
- No errors (clean console)
- May see some informational messages (white/gray text)

### Step 3: Test Basic Functionality

1. **Domain Switching:**
   - Click on Healthcare, Education, Finance tabs in sidebar
   - Verify the title and color theme changes

2. **Text Query:**
   - Type a query in the input field (e.g., "What are common flu symptoms?")
   - Click the arrow button or press Enter
   - Verify you see a response from the AI

3. **Agent Dashboard:**
   - Click the three-dot menu icon in the top-right
   - Verify the Agent Dashboard modal opens
   - Check that agents are displayed for the selected domain

4. **Voice Link (Optional):**
   - Click the "Voice Link" button (microphone icon)
   - Grant microphone permission when prompted
   - Speak a query and verify transcription appears

### Step 4: Verify Network Requests

1. Open Developer Tools (F12)
2. Go to the **Network** tab
3. Send a text query
4. Look for requests to Google's API endpoints

**Expected:**
- Requests to `generativelanguage.googleapis.com`
- Status code 200 (successful)
- Response contains AI-generated content

### Step 5: Check TypeScript Compilation

Run TypeScript compiler to verify no type errors:

```bash
npx tsc --noEmit
```

**Expected output:**
```
(no output - means no errors)
```

If there are errors, they will be displayed with file paths and line numbers.

---

## 🔧 Troubleshooting

### Issue 1: "Cannot find module 'vite'" or similar errors

**Cause:** Dependencies not installed

**Solution:**
```bash
npm install
```

### Issue 2: "VITE_API_KEY is not defined"

**Cause:** Environment variable not set or incorrect prefix

**Solution:**
1. Check that `.env` file exists in project root
2. Verify the variable name is `VITE_API_KEY` (not `API_KEY`)
3. Restart the dev server after creating/modifying `.env`:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

### Issue 3: Port 5173 already in use

**Cause:** Another process is using the port

**Solution 1:** Kill the existing process
```bash
# Windows (Command Prompt)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Windows (PowerShell)
Get-NetTCPConnection -LocalPort 5173 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

**Solution 2:** Use a different port
```bash
npm run dev -- --port 3000
```

### Issue 4: API Key errors (401, 403)

**Cause:** Invalid or missing API key

**Solution:**
1. Verify your API key is correct
2. Check that the key has the necessary permissions
3. Ensure the key is not expired
4. Check Google Cloud Console for quota limits

### Issue 5: Microphone permission denied

**Cause:** Browser security settings

**Solution:**
1. Check browser permissions (click lock icon in address bar)
2. Ensure you're using HTTPS or localhost
3. Try a different browser (Chrome recommended)
4. Check system microphone settings

### Issue 6: Build fails with TypeScript errors

**Cause:** Type mismatches or missing type definitions

**Solution:**
```bash
# Check for type errors
npx tsc --noEmit

# If @types/node is missing
npm install --save-dev @types/node

# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue 7: Tailwind CSS not working

**Cause:** Missing or incorrect configuration

**Solution:**
1. Verify [`tailwind.config.js`](tailwind.config.js:1) exists
2. Check [`postcss.config.js`](postcss.config.js:1) exists
3. Ensure content paths are correct in [`tailwind.config.js`](tailwind.config.js:4)
4. Restart dev server

### Issue 8: Import errors for @google/genai

**Cause:** Package not installed or incorrect version

**Solution:**
```bash
# Reinstall the package
npm install @google/genai@^1.39.0

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📁 Project Structure

```
multi/
├── .env                    # Environment variables (create this)
├── .env.example           # Environment template
├── .gitignore             # Git ignore rules
├── index.html             # HTML entry point
├── index.tsx              # React entry point
├── App.tsx                # Main application component
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── vite-env.d.ts          # Vite type definitions
├── package.json           # Dependencies and scripts
├── types.ts               # TypeScript type definitions
├── constants.ts           # Application constants
├── components/            # React components
│   ├── AgentDashboard.tsx
│   └── Sidebar.tsx
└── services/              # External services
    └── gemini.ts          # Google GenAI integration
```

---

## 🎯 Key Files Explained

| File | Purpose |
|------|---------|
| [`package.json`](package.json:1) | Lists dependencies and npm scripts |
| [`vite.config.ts`](vite.config.ts:1) | Vite build configuration |
| [`tsconfig.json`](tsconfig.json:1) | TypeScript compiler options |
| [`tailwind.config.js`](tailwind.config.js:1) | Tailwind CSS configuration |
| [`index.html`](index.html:1) | HTML template with root div |
| [`index.tsx`](index.tsx:1) | React application entry point |
| [`App.tsx`](App.tsx:1) | Main React component |
| [`services/gemini.ts`](services/gemini.ts:1) | AI service integration |
| [`types.ts`](types.ts:1) | TypeScript interfaces and enums |
| [`constants.ts`](constants.ts:1) | Domain and agent configurations |

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check only
npx tsc --noEmit

# Clean install (remove node_modules and reinstall)
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Additional Resources

- **Vite Documentation:** https://vitejs.dev/
- **React Documentation:** https://react.dev/
- **TypeScript Documentation:** https://www.typescriptlang.org/
- **Tailwind CSS Documentation:** https://tailwindcss.com/
- **Google GenAI SDK:** https://ai.google.dev/gemini-api/docs
- **Google AI Studio:** https://aistudio.google.com/

---

## ⚠️ Security Notes

1. **Never commit `.env` file** - It contains sensitive API keys
2. **Use environment-specific files** - `.env.development`, `.env.production`
3. **Rotate API keys regularly** - Especially if compromised
4. **Monitor API usage** - Check Google Cloud Console for quotas
5. **Implement rate limiting** - For production deployments

---

## 🎉 Success Criteria

You have successfully set up the application if:

- ✅ All dependencies installed without errors
- ✅ `.env` file created with valid `VITE_API_KEY`
- ✅ Development server starts on `http://localhost:5173`
- ✅ Application loads in browser without console errors
- ✅ Can switch between Healthcare, Education, Finance domains
- ✅ Can send text queries and receive AI responses
- ✅ Agent Dashboard opens and displays agents
- ✅ TypeScript compilation passes without errors
- ✅ Production build completes successfully

---

## 📞 Support

If you encounter issues not covered in this guide:

1. Check the browser console for error messages
2. Review the terminal output for build errors
3. Verify all prerequisites are installed
4. Ensure environment variables are correctly set
5. Try clearing the cache and reinstalling dependencies

---

**Last Updated:** 2026-02-01
**Version:** 1.0.0