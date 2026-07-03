# Placement Tracker Pro 🚀

A highly customized, unified dashboard designed to help you track your 90-day placement preparation journey.

## Features
- **Unified Dashboard**: Everything you need in one single view—progress bars, category stats, and day-by-day roadmap.
- **Mobile Responsive**: Fully usable on mobile with a sleek drawer menu and stacked layouts.
- **Real Database Sync**: Backed by MongoDB Atlas to keep your data safe and synced across all your devices.
- **Admin Authentication**: Lock down your edits with a secure Admin Login mode (Read-only by default).
- **Dynamic Task Tracking**: Inline text editing, custom tags (DSA, AI, Backend Web, Core, Aptitude), and seamless checkbox tracking.
- **Dark Mode UI**: Beautiful, glassmorphism-inspired dark mode built with Tailwind CSS and Shadcn UI.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS & Shadcn UI (Base UI)
- **State Management**: Zustand
- **Database**: MongoDB (Mongoose)
- **Deployment**: Vercel

## Local Development
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add your MongoDB URI:
   ```env
   MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/placement_tracker?retryWrites=true&w=majority"
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Default Admin Credentials
To unlock editing capabilities on the dashboard, click "Admin Login" in the header and use the following default credentials:
- **Username**: `rithesh`
- **Password**: `rithesh07`
