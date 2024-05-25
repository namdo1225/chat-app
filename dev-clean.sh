docker compose stop
(cd backend && npx supabase stop)
docker network disconnect chat-app-dev-network chat-app-backend-dev
docker network disconnect chat-app-dev-network supabase_kong_backend
docker network rm chat-app-dev-network