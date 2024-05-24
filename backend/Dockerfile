FROM node

WORKDIR /usr/src/app

COPY . .

RUN npm ci --only=production --legacy-peer-deps

ENV DEBUG=express:*

CMD npm run build && npm start
