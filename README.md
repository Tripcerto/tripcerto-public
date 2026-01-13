# TripCerto Landing Page

A modern, responsive landing page built with Next.js 14, TypeScript, and Tailwind CSS.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Supabase** - Backend-as-a-Service (database + edge functions)

## Features

- Responsive design that works on all devices
- Modern UI with smooth animations and transitions
- SEO optimized with Next.js metadata
- Fast performance with Next.js optimizations
- Type-safe with TypeScript
- Interest registration form with Supabase edge function
- Form validation and error handling

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Update `.env.local` with your Supabase project URL and anon key.

### 3. Set Up Supabase (Optional for local development)

If you want to test the interest registration form locally:

```bash
# Install Supabase CLI
npm install -g supabase

# Start Supabase locally
cd supabase
supabase start
```

See [supabase/README.md](./supabase/README.md) for detailed Supabase setup instructions.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/
│   ├── globals.css      # Global styles with Tailwind
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/
│   ├── Hero.tsx         # Hero section with navigation
│   ├── Features.tsx     # Features grid
│   ├── CTA.tsx          # Call-to-action section
│   ├── InterestForm.tsx # Interest registration form
│   └── Footer.tsx       # Footer with links
├── lib/
│   └── supabase.ts      # Supabase client configuration
├── supabase/
│   ├── functions/       # Edge functions
│   │   └── register-interest/
│   ├── migrations/      # Database migrations
│   └── config.toml      # Supabase configuration
└── public/              # Static assets
```

## Building for Production

```bash
npm run build
npm start
```

## License

MIT
