FROM node AS build-stage

WORKDIR /usr/src/app

ENV REACT_APP_BACKEND_URL="http://localhost:8080/api"

ENV CI=true

COPY . .

RUN npm install

RUN npm test

RUN npm run build

FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html