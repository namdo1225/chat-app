FROM node

WORKDIR /usr/src/app

COPY . .

RUN npm install --legacy-peer-deps

ENV DEBUG=express:*

CMD npm run build && npm start
