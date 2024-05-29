docker run -p 6379:6379 --name redis-dev-native -d redis
(cd backend && npx supabase start)