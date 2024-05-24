FROM node as prod

WORKDIR /usr/src/app

ENV REACT_APP_BACKEND_URL="http://localhost:8080/api"

ENV CI=true

COPY . .

RUN npm install  --legacy-peer-deps

# RUN npm test

RUN npm run build
