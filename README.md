# CA Chat (AKA Chat App Chat)

To demonstrate what I have learned about full-stack web development, I have decided to create a simple chat app in TypeScript with React for the frontend and Node.js for the backend. It also uses library such as React Router, toast, etc.

**If the server is down and you want to check it out, please email me at [namdo1204@gmail.com](mailto:namdo1204@gmail.com) so that I can take a look.**

The website is available at: https://chat-app-go19.onrender.com

Video Demo: https://youtu.be/i5-T1kOSDrs

## Features

-   Make multiple chat groups with one or more users
-   Friend system: Make friends and add them to private chat groups
-   Appearance customization: Light/dark mode and ability to change message box/text's color
-   Optional end-to-end encryption system to encrypt messages
-   Make chats and/or your user profile discoverable or private
-   You can use emojis (express yourself!)

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

1. Clone the repository. The repository is separated into a frontend and backend folder. Both folders are their own projects, so the following instructions might need to be done in both folders:
2. Of course, this uses a lot of env variables. Make sure that you have your own Supabase project and Resend service keys put in a `.env` file.
3. If you look into my package.json files, you can see that I use different `.env` files depending on the environment. That means that you will have to create custom `.env` files based on specific environments. I will put a template for a standard env file in both projects.
4. Install npm packages using: `npm i --legacy-peer-deps`.
5. In the chat-app folder, you can use `./dev.sh` to run the dev environment in Docker.
6. Otherwise, you can manually go to chat-app/frontend and chat-app/backend on separate terminals to run: npm run dev:native.

### Docker

To containerize and abstract many services of this app, I use Docker to improve development. I have created various scripts in the root to aid in development if you decide to checkout this repository.

Some facts:

-   The Redis service is always behind Docker, regardless of whether the web application is running natively or in Docker. Use redis-dev as the URl if you're in the same container stack as the web application. Otherwise, use localhost.

| Mode            | Can Use Docker? | Notes                                                 |
| --------------- | --------------- | ----------------------------------------------------- |
| **Development** | Yes             |                                                       |
| **Production**  | No              | Front and Backend needs manual start                  |
| **Test**        | No              | Use `dev:native` to start front- and back-end for e2e |

## Why I am not using Next.js or other higher-level frameworks?

This is meant to be a basic demonstration of everything I have learnt in full-stack web development. Next.js provides useful routing and navigation utility, but I want to get into the lower level to see how it works. It is important these tools before moving on to more advanced technology.

# Other Details

- cron jobs are scheduled (via cron-job.org) to health check the backend "every 10 minutes, at 12:00 AM through 01:00 AM and 08:00 AM through 11:59 PM, Sunday through Friday." (UTC).
`*/10 0-1,8-23 * * 0-5`
