# Cognisphere Environment Setup

## Supabase Configuration

You need to create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Supabase Access Token
SUPABASE_ACCESS_TOKEN=sbp_c1e2f1d8741a7c9ae092ff2f2bf2a9a504c568cb
```

## How to Get Your Supabase Credentials

1. Go to your Supabase Dashboard
2. Select your project
3. Go to Settings > API
4. Copy the Project URL and paste it as `NEXT_PUBLIC_SUPABASE_URL`
5. Copy the anon/public key and paste it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Database Setup

1. In your Supabase Dashboard, go to SQL Editor
2. Run the SQL script from `supabase/schema.sql`
3. Then run the RLS policies from `supabase/rls-policies.sql`
