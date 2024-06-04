/**
 * Contains the express application and its API routings.
 */

import app from "./expressApp";
import {
    requestLogger,
    unknownEndpoint,
    errorHandler,
} from "./utils/middleware";

import usersRouter from "./controllers/users";
import logoutRouter from "./controllers/logout";
import resendRouter from "./controllers/resend";
import chatsRouter from "./controllers/chats";
import contactRouter from "./controllers/contact";
import friendsRouter from "./controllers/friends";
import chatMembersRouter from "./controllers/chat_members";
import messagesRouter from "./controllers/messages";
import wipeRouter from "./controllers/wipe";

import { slowDown } from "express-slow-down";
import { rateLimit } from "express-rate-limit";
import { NODE_ENV } from "./utils/config";

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const slow = slowDown({
    windowMs: FIFTEEN_MINUTES,
    delayAfter: 2, // Allow 2 requests per 15 minutes.
    delayMs: (hits) => hits * 1000, // Add 1000 ms of delay to
    // every request after the 2nd one.
});

const rateLimiter = rateLimit({
    windowMs: FIFTEEN_MINUTES,
    limit: 10, // Limit each IP to 10 requests per windowMs.
});

if (NODE_ENV === "development") app.use(requestLogger);

app.use("/logout", logoutRouter);
app.use("/resend", slow, resendRouter);
app.use("/users", usersRouter);
app.use("/chats", chatsRouter);
app.use("/contact", rateLimiter, contactRouter);
app.use("/friends", friendsRouter);
app.use("/chat_members", chatMembersRouter);
app.use("/messages", messagesRouter);

if (NODE_ENV !== "production") app.use("/wipe", wipeRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
