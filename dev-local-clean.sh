docker stop redis-dev-native
docker rm redis-dev-native
(cd backend && npx supabase stop)