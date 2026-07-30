# Goal Quest

A check-in tool that breaks long-term goals into small daily tasks. Every completed
task earns experience points (XP), and accumulated XP maps to overall goal progress —
turning routine studying into something more like leveling up in a game.

## Features

- Create multiple Goals, each with a total target XP as the finish line
- Add Tasks under a Goal; each task is worth some XP, check it off to earn it
- Goal detail page shows an overall progress bar plus a "journey" path with
  customizable Milestones
- Daily To-Do list: quick one-off items for today, unrelated to any goal
- Pomodoro timer: adjustable focus/break duration via slider, tracks how many
  you've completed today, name each session and see a time-breakdown pie chart
- A little line-drawing cat studies alongside you during focus sessions; earn
  coins for every focus minute, spend them on snacks or unlockable cat skins
- Statistics page: view your pomodoro time breakdown by Day / Week / Month
- Daily To-Do list: date navigation to browse what you did on any past day
- One-click Chinese/English language switch (top right), preference saved locally
- Accounts: everyone signs up with their own email, data syncs to the cloud and
  follows you across devices

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Supabase (auth + cloud database)
- lucide-react (icons)

## Accounts

Everyone needs to sign up with their own email to use the app. Once signed in, you
only see and manage your own goals/tasks — data lives in a Supabase cloud database
and follows you when you sign in on another device. Row Level Security is enabled
on the database, so users can never see each other's data at the database level.

The table-creation SQL lives in `supabase/schema.sql` (goals/tasks/milestones) and
`supabase/schema_v2_daily_pomodoro.sql` (daily to-dos/pomodoro sessions). To set up
a new Supabase project, run both scripts in the SQL Editor.

## Running locally

Create a `.env.local` file in the project root (this file is not committed to git);
see `.env.example` for the format:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

You can find both values under Project Settings → Data API in your Supabase project.

```bash
npm install
npm run dev
```

Open the local address printed in the terminal (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview   # preview the production build locally
```

## Deployment

Vercel or Netlify are both good options:

1. Push this repo to GitHub
2. In Vercel/Netlify, choose "Import Project" and connect this GitHub repo
3. Set the build command to `npm run build` and the output directory to `dist`
4. **Important**: in the project's Environment Variables settings, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   (since `.env.local` isn't committed to GitHub, the deployed site needs these
   set manually, otherwise sign in/sign up will fail in production)
5. Deploy — you'll get a live URL within a couple of minutes

## Data model

```ts
interface Task {
  id: string;
  title: string;
  xp: number;
  done: boolean;
}

interface Milestone {
  id: string;
  title: string;
  thresholdXp: number; // unlocks at this much XP
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetXp: number;      // target total XP for the goal
  tasks: Task[];
  milestones: Milestone[];
}
```

## Possible future directions

- Data export/import as JSON backup
- Analytics on completion patterns (e.g. which days you finish more tasks)
- Multi-goal overview dashboard
- Push notifications/reminders for daily to-dos
