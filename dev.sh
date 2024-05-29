docker network create chat-app-dev-network
(cd backend && npx supabase start)
docker compose -f docker-compose.dev.yml up -d
docker network connect chat-app-dev-network chat-app-backend-dev
docker network connect chat-app-dev-network supabase_kong_backend
docker compose -f docker-compose.dev.yml logs --follow