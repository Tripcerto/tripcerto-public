# Supabase Configuration

This directory contains the Supabase configuration for the TripCerto project.

## Setup

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Initialize Supabase (if starting fresh)

The project is already initialized, but if you need to link to a remote project:

```bash
supabase login
supabase link --project-ref your-project-ref
```

### 3. Start Local Development

```bash
supabase start
```

This will start:
- PostgreSQL database (port 54322)
- Supabase Studio (port 54323)
- Edge Functions (port 54325)

### 4. Run Migrations

```bash
supabase db reset
```

This will create the `interest_registrations` table with proper indexes and RLS policies.

### 5. Deploy Edge Function

To deploy the register-interest edge function to production:

```bash
supabase functions deploy register-interest
```

### 6. Set Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Get your Supabase URL and anon key from your Supabase project settings.

## Database Schema

### interest_registrations table

- `id` (UUID): Primary key
- `name` (TEXT): User's name
- `email` (TEXT): User's email (unique)
- `registered_at` (TIMESTAMP): When they registered interest
- `created_at` (TIMESTAMP): Record creation time

## Edge Functions

### register-interest

Handles user interest registrations from the landing page.

**Endpoint**: `POST /functions/v1/register-interest`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Thank you for your interest! We'll be in touch soon.",
  "data": { ... }
}
```

**Error Responses**:
- 400: Invalid input (missing name/email or invalid email format)
- 409: Email already registered
- 500: Server error

## Local Development URLs

- Studio: http://localhost:54323
- API: http://localhost:54321
- Database: postgresql://postgres:postgres@localhost:54322/postgres
- Edge Functions: http://localhost:54321/functions/v1

## Testing the Edge Function Locally

```bash
# Using curl
curl -X POST http://localhost:54321/functions/v1/register-interest \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com"}'
```
