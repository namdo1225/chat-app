import "express-async-errors";
import { info, logError } from "./logger";
import { verify } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { SECRET } from "./config";

interface JwtPayload {
    id?: string
}

const requestLogger = (
    request: Request,
    _response: Response,
    next: NextFunction
): void => {
    info("Method:", request.method);
    info("Path:  ", request.path);
    info("Body:  ", request.body);
    info("---");
    next();
};

const unknownEndpoint = (_request: Request, response: Response): void => {
    response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (
    error: Error,
    _request: Request,
    response: Response,
    next: NextFunction
): void => {
    logError(error.message);

    if (error.name === "CastError") {
        response.status(400).send({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
        response.status(400).json({ error: error.message });
    } else if (error.name === "JsonWebTokenError") {
        response.status(400).json({ error: error.message });
    } else if (error.name === "TokenExpiredError") {
        response.status(401).json({
            error: "token expired",
        });
    } else
        next(error);
};

const userExtractor = (
    request: Request,
    response: Response,
    next: NextFunction
): void => {
    if (request.token) {
        const decodedToken = verify(request.token, SECRET) as JwtPayload;
        if (!decodedToken.id) {
            response.status(401).json({ error: "token invalid" });
        }

        //request.user = await User.findById(decodedToken.id);
    } else {
        //request.user = null;
    }

    next();
};

const tokenExtractor = (
    request: Request,
    _response: Response,
    next: NextFunction
): void => {
    const authorization = request.get("authorization");
    if (authorization && authorization.startsWith("Bearer "))
        request.token = authorization.replace("Bearer ", "");
    else request.token = null;

    next();
};

export {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    userExtractor,
    tokenExtractor,
};
