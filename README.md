# CA Chat (AKA Chat App Chat)

To demonstrate what I have learned about full-stack web development, I have decided to create a simple chat app in TypeScript with React for the frontend and Node.js for the backend. It also uses library such as React Router, toast, etc.

The website is available at: https://chat-app-go19.onrender.com

## Features

-   Friend system
-   Make multiple chat groups with one or more users
-   Appearance customization: Light/dark mode and ability to change message box/text's color
-   Optional end-to-end encryption system to encrypt messages
-   Make chats and/or your user profile discoverable or private.

## Tech Stack

### Frontend

-   MaterialUI
-   React
-   Supabase
-   TailwindCSS
-   TypeScript
-   Vue.js
-   Yup Type Validation Library

### Backend

-   Express
-   Node.js
-   Redis
-   Supabase
-   TypeScript
-   WebSocket
-   Zod Type Validation Library

## How to Run

Prerequisites:

-   Redis
-   Node.js
-   Git
-   Docker (for better dev experience and hosting at the end of the day)
-   A [Supabase](https://supabase.com) project
-   A [Resend](https://resend.com/) API key
-   An [HCaptcha](https://www.hcaptcha.com/) sitekey and private key

1. Clone the repository. The repository is separated into a frontend and backend folder.
2. Of course, this uses a lot of env variables. Make sure that you have your own Supabase project and Resend service keys put in a .env file.
3. If you look into my package.json files, you can see that I use different .env files depending on the environment. That means that you will have to create custom .env files based on specific environments. I will put a template for a standard env file in both projects.
4. Install npm packages using: npm install.
5. In the chat-app folder, you can use ./dev.sh to run the dev environment in Docker.
6. Otherwise, you can manually go to chat-app/frontend and chat-app/backend on separate terminals to run: npm run dev:native.

### Docker

To containerize and abstract many services of this app, I use Docker to improve development. I have created various scripts in the root to aid in development if you decide to checkout this repository.

Some facts:

-   The Redis service is always behind Docker, regardless of whether the web application is running natively or in Docker. Use redis-dev as the URl if you're in the same container stack as the web application. Otherwise, use localhost.

| Mode            | Can Use Docker? | Notes                                        |
| --------------- | --------------- | -------------------------------------------- |
| **Development** | Yes             |                                              |
| **Production**  | No              | Front and Backend needs manual start         |
| **Test**        | No              | Front and Backend needs manual start for e2e |

## Why I am not using Next.js or other higher-level frameworks?

This is meant to be a basic demonstration of everything I have learnt in full-stack web development. Next.js provides useful routing and navigation utility, but I want to get into the lower level to see how it works. It is important these tools before moving on to more advanced technology.
