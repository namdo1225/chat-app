docker compose -f docker-compose.dev.local.yml up -d
(cd backend && npx supabase start)
(cd backend && npx supabase db reset)