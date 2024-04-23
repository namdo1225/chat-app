FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm install --legacy-peer-deps

ENV WATCHPACK_POLLING = true

# npm start is the command to start the application in development mode
CMD ["npm", "run", "dev", "--", "--host"]