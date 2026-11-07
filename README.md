# SamTrack OS

A personal productivity dashboard for building consistent study habits, tracking DSA practice, organizing tasks, and reviewing progress.

## Features

- **Dashboard:** daily overview and progress signals
- **Habit tracker:** monthly habit grid and consistency tracking
- **Tasks:** organize study and personal work
- **DSA tracker:** record solved problems, platform, difficulty, and practice history
- **Analytics:** streaks, activity history, and weekly/monthly summaries
- **Sam AI Coach:** optional study guidance powered by the Google Gemini API
- **LeetCode sync:** fetch public profile statistics and recent accepted submissions by username
- **Local data:** browser-local persistence, with CSV export and printable reports
- **Theme:** light and dark modes

## Tech stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS 3
- Framer Motion
- Recharts
- Lucide React
- Google Gemini API (optional AI Coach integration)
- LeetCode GraphQL endpoint (public profile sync)

## Requirements

- Node.js 20 or newer
- npm
- A Google Gemini API key only if you want to use Sam AI Coach

## Getting started

```bash
git clone https://github.com/sakshamsingh22/SamTrack-OS.git
cd SamTrack-OS
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Set `GEMINI_API_KEY` in `.env.local` to enable the AI Coach. The model can be changed with `GEMINI_MODEL`. Keep real credentials out of Git.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Create a production build:

```bash
npm run build
npm start
```

## API routes

| Route | Purpose |
|---|---|
| `POST /api/ai-coach` | Sends a short conversation and study context to Gemini and returns a coach response |
| `GET /api/leetcode/[username]` | Retrieves public LeetCode profile and recent accepted-submission data |

The LeetCode integration depends on an external, undocumented GraphQL endpoint and may change or become rate-limited.

## Data and security notes

- **This is currently a browser-local prototype.** Accounts, session state, habits, tasks, and DSA records are stored in the browser's `localStorage`; they are not synchronized to a server or across devices.
- The current client-side account flow is for a personal/demo experience, **not production-grade authentication**. Do not use it to protect sensitive information or treat its password hashing as a substitute for server-side authentication.
- Clearing browser storage or switching browsers/devices can remove or hide locally stored data. Export important records before clearing site data.
- The Gemini API key is read by the server route. Configure it as a server-side environment variable in production and never expose it in client-side code.
- AI-generated advice can be incomplete. Review suggestions and make your own decisions.
- LeetCode sync uses public profile data and may fail if the upstream service changes its schema or applies rate limits.

## Project structure

```text
app/
  api/
    ai-coach/
    leetcode/
  globals.css
  layout.js
  page.js
components/
  layout/
  sections/
  ui/
  auth-screen.js
  sam-track-app.js
lib/
  sam-track.js
```

## Roadmap ideas

- Add server-side authentication and a database for multi-device sync
- Add automated tests for data normalization, streak calculations, and API routes
- Add input validation, rate limiting, and safer upstream error handling
- Add screenshots or a short demo video to document the user experience

## License

No license file is currently included. Contact the repository owner before reusing this project in another product.
