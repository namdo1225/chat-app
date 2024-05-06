# CA Chat (AKA Chat App Chat)

To demonstrate what I have learned about full-stack web development, I have decided to create a simple chat app in TypeScript with React for the frontend and Node.js for the backend. It also uses library such as React Router, toast, etc.

The website is available at: 

## Features

- Friend system
- Make multiple chat groups with one or more users with the ability to make the chat public or private
- Dark mode

## Tech Stack

### Frontend
- React
- Vue.js
- Supabase
- TypeScript

### Backend
- Node.js
- Express
- Supabase
- Websocket
- Redis
- TypeScript

## How to Run

Prerequisites:
- Redis
- Node.js
- Git
- Docker (for better dev experience and hosting at the end of the day)
- A [Supabase](https://supabase.com) project
- A [Resend](https://resend.com/) API key

1. Clone the repository.
2. Of course, this uses a lot of env variables. Make sure that you have your own Supabase project and Resend service keys put in a .env file.
3. Install npm packages using: npm install.
4a. In the chat-app folder, you can use ./dev.sh to run the dev environment in Docker.
4b. Otherwise, you can manually go to chat-app/frontend and chat-app/backend on separate terminals to run: npm run dev.

## Why I am not using Next.js or other higher-level frameworks?

This is meant to be a basic demonstration of everything I have learnt in full-stack web development. Next.js provides useful routing and navigation utility, but I want to get into the lower level to see how it works. It is important these tools before moving on to more advanced technology.