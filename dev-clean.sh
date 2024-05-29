docker network disconnect chat-app-dev-network chat-app-backend-dev
docker network disconnect chat-app-dev-network supabase_kong_backend
docker compose -f docker-compose.dev.yml down
(cd backend && npx supabase stop)
docker network rm chat-app-dev-network