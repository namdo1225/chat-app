import express from "express";
import cors from "cors";
import helmet from "helmet";
import {
    tokenExtractor,
    requestLogger,
    unknownEndpoint,
    errorHandler,
} from "./utils/middleware";

import usersRouter from "./controllers/users";
import loginRouter from "./controllers/login";
import resendRouter from "./controllers/resend";

const app = express();
app.use(tokenExtractor);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(requestLogger);

app.use('/api/login', loginRouter);
app.use('/api/resend', resendRouter);
app.use('/api/users', usersRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
