docker network create chat-app-dev-network
docker compose -f docker-compose.dev.yml up -d
(cd backend && npx supabase start)
docker network connect chat-app-dev-network chat-app-backend-dev
docker network connect chat-app-dev-network supabase_kong_backend