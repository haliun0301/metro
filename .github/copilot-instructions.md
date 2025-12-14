# Copilot Instructions for Shenzhen Metro AI Map

## Project Overview
- **Purpose:** Interactive Shenzhen Metro map with AI-powered chat assistant for metro navigation, station info, and route planning.
- **Tech Stack:** React (TypeScript), Vite, Gemini AI API (Google GenAI), Tailwind CSS (utility classes in JSX), custom data for metro lines/stations.

## Architecture & Key Files
- **App.tsx:** Main entry, composes `GisMap` (map UI) and `ChatWidget` (AI chat).
- **components/GisMap.tsx:** Core map logic, renders stations/routes, handles user interaction, props-driven (see `types.ts`).
- **components/ChatWidget.tsx:** Floating AI chat, uses Gemini API via `services/geminiService.ts`.
- **services/geminiService.ts:** Handles chat with Gemini, injects system prompt for metro expertise, expects `process.env.API_KEY` (set via `.env.local` as `GEMINI_API_KEY`).
- **data/metroRoutes.ts, data/stations.ts:** Large static arrays for all metro lines and stations, imported into map and chat context.
- **types.ts:** Central TypeScript types for map, stations, and chat messages.

## Developer Workflows
- **Install:** `npm install`
- **Run locally:** `npm run dev` (Vite, port 3000)
- **API Key:** Set `GEMINI_API_KEY` in `.env.local` (not checked in)
- **No built-in tests** (as of Dec 2025)

## Patterns & Conventions
- **Props-driven UI:** All map and chat state flows via props and React state/hooks.
- **Data shape:** Metro data is flat arrays, not normalized DB-style.
- **AI context:** ChatWidget passes current map context (e.g., visible stations) to Gemini for more relevant answers.
- **Error handling:** User-facing errors are friendly, logged to console for devs.
- **No Redux or global state:** All state is local/component-level.
- **No backend/server:** Purely static frontend, all AI handled client-side via Gemini API.

## Integration & Extensibility
- **Gemini API:** Uses `@google/genai` npm package. System prompt is tailored for Shenzhen Metro expertise.
- **Adding new lines/stations:** Update `data/metroRoutes.ts` and `data/stations.ts`.
- **Styling:** Uses Tailwind utility classes inline; no separate CSS files.

## Examples
- To add a new station: append to `STATIONS` in `data/stations.ts`.
- To change map style: update `mapStyle` prop in `App.tsx` or `GisMap.tsx`.
- To customize AI prompt: edit `systemInstruction` in `services/geminiService.ts`.

## References
- See [README.md](../README.md) for setup and run instructions.
- See `types.ts` for all prop/data shapes.

---
For questions, review the above files for patterns. When in doubt, follow the prop-driven, stateless, and modular approach seen in `GisMap` and `ChatWidget`.
