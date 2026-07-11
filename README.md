# Aura

A social media UI concept with AI-powered features — write captions and generate images for posts using Google's Gemini API.

## Features

- Instagram-style feed, stories, and profile views
- AI-generated captions for uploaded photos (Gemini 2.5 Flash)
- AI image generation from text prompts (Gemini 2.5 Flash Image)
- Falls back to a simulated caption if no API key is configured, so the UI stays fully explorable without one

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Google Gemini API (`@google/genai`)
- Lucide React icons

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```
   npm install
   ```
2. Create a `.env.local` file and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_key_here
   ```
3. Run the dev server:
   ```
   npm run dev
   ```

Get a free Gemini API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

## Build

```
npm run build
```

---

Built by [Faizan](https://portfolio-seven-opal-80.vercel.app/) — Android & full-stack developer.
