FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm install --legacy-peer-deps

RUN npm install -g wscat

CMD ["npm", "run", "dev"]