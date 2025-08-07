# Pappaya Academy - School Management System

## Project Overview

A comprehensive school management system featuring AI-powered tools for timetabling, grading, lesson planning, and complete educational administration.

## Project Features

- AI-powered timetable generation
- Smart grading assistant
- Comprehensive lesson planning
- Student information management
- Fee management system
- Communication tools
- Reporting and analytics

## How to edit this code?

There are several ways to edit your application:

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Backend & Database)

## Deployment

You can deploy this project using various hosting platforms such as:

- Vercel
- Netlify  
- Firebase Hosting
- Or any other static hosting service

## Database Setup

This project uses Supabase as the backend. Make sure to:

1. Set up your Supabase project
2. Configure the database schema
3. Update the environment variables
4. Run any necessary migrations

## Important Note

After removing Lovable references, you'll need to manually copy the logo images:

1. Copy `public/lovable-uploads/0a977b5c-549a-4597-a296-a9e51592864a.png` to `public/assets/logo.png`
2. Copy `public/lovable-uploads/e3097ebb-81b4-43c3-9c06-5e7eaad0330b.png` to `public/assets/favicon.png`
3. You can then delete the `public/lovable-uploads/` directory if desired