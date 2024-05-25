/**
 * Contains the express application initial setup.
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { unknownEndpoint, errorHandler } from "./utils/middleware";
import healthCheckRouter from "./controllers/health_check";

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.disable("x-powered-by");
app.use("/health_check", healthCheckRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
