import "express-async-errors";
import { info, logError } from "./logger";
import { NextFunction, Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import { fileImageHandler } from "@/utils/handler";
import { supabase } from "@/supabase";
import { HCaptchaSchema } from "@/types/zod";
import { ChatSchema } from "@/types/chat";
import { UserChangeSchema } from "@/types/user";
import axios from "axios";
import { HCAPTCHA_SECRET, PROFILE_WIDTH_HEIGHT } from "./config";
import { z } from "zod";
import { createReadStream } from "streamifier";

/**
 * Log a request to the API.
 * @param {Request} request Contains request info.
 * @param {Response} _response Contains response info.
 * @param {NextFunction} next The function that will run after this middleware.
 */
const requestLogger = (
    request: Request,
    _response: Response,
    next: NextFunction
): void => {
    info(
        `Method: ${request.method}\nPath:  ${request.path}\nBody:  ${request.body}\n---`
    );
    next();
};

/**
 * Check for unknown endpoint case.
 * @param {Request} _request Contains request info.
 * @param {Response} response Contains response info.
 */
const unknownEndpoint = (_request: Request, response: Response): void => {
    response.status(404).send({ error: "unknown endpoint" });
};

/**
 * Error handling middleware for most functions
 * @param {Error} error Contains error info.
 * @param {Request} _request Contains request info.
 * @param {Response} _response Contains response info.
 * @param {NextFunction} next The function that will run after this middleware.
 */
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
    } else if (error.name === "MulterError") {
        response.status(400).json({ error: error.message });
    } else if (error.name === "ZodError") {
        response.status(400).json({ error: error.message });
    } else next(error);
};

/**
 * Extracts a user to request.user based on provided token in request.token.
 * @param {Request} request Contains request info.
 * @param {Response} response Contains response info.
 * @param {NextFunction} next The function that will run after this middleware.
 */
const userExtractor = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    const { data: foundUser } = await supabase.auth.getUser(
        request.token as string
    );

    if (foundUser.user) {
        request.user = foundUser.user;
        next();
    } else response.status(400).json({ error: "No user found." });
};

/**
 * Extracts Bearer access token in Auth header of request
 * and put it into request.token.
 * @param {Request} request Contains request info.
 * @param {Response} response Contains response info.
 * @param {NextFunction} next The function that will run after this middleware.
 */
const tokenExtractor = (
    request: Request,
    response: Response,
    next: NextFunction
): void => {
    const authorization = request.get("authorization");

    if (authorization && authorization.startsWith("Bearer ")) {
        request.token = authorization.replace("Bearer ", "");
        next();
    } else
        response
            .status(400)
            .json({ error: "No bearer access token provided." });
};

const storage = multer.memoryStorage();

/**
 * Multer object to handle image uploading and parsing.
 */
const upload = multer({
    storage,
    fileFilter: fileImageHandler,
    limits: { fileSize: 50_000 /* 50 KB */ },
});

const imageParser = upload.single("photo");

/**
 * Extracts file from request.file and put its extension into request.fileData
 * and file data into request.fileData.
 * @param {Request} request Contains request info.
 * @param {Response} response Contains response info.
 * @param {NextFunction} next The function that will run after this middleware.
 */
const fileExtractor = (
    request: Request,
    _response: Response,
    next: NextFunction
): void => {
    const file = request.file as Express.Multer.File | null;
    if (file) {
        request.fileData = createReadStream(file.buffer);
        request.fileExtension = file.mimetype.split("/")[1];
        next();
    }
    next();
};

/**
 * Edits provided user's profile picture and put result in request.fileExtension
 * and request.fileData.
 * @param {Request} request Contains request info.
 * @param {Response} response Contains response info.
 * @param {NextFunction} next The function that will run after this middleware.
 */
const profileImgEditor = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    const file = request.file as Express.Multer.File | null;

    if (file) {
        const { x, y, width, height } = UserChangeSchema.parse(request.body);
        if (
            x === undefined ||
            y === undefined ||
            width === undefined ||
            height === undefined
        )
            response
                .status(400)
                .json({ error: "No extraction options provided." });
        else {
            const imageHW = await sharp(file.buffer).metadata();
            if (!imageHW.width || !imageHW.height)
                response
                    .status(400)
                    .json({ error: "Image has no width or height." });
            else {
                const left = Math.floor(x * imageHW.width);
                const top = Math.floor(y * imageHW.height);

                const buffer = await sharp(file.buffer)
                    .extract({
                        left,
                        top,
                        width: Math.floor(width * imageHW.width),
                        height: Math.floor(height * imageHW.height),
                    })
                    .resize(PROFILE_WIDTH_HEIGHT, PROFILE_WIDTH_HEIGHT)
                    .toFormat("jpg")
                    .jpeg({ quality: 95, force: true })
                    .toBuffer();

                request.fileData = createReadStream(buffer);
                request.fileExtension = "jpg";
                next();
            }
        }
    } else next();
};

/**
 * Retrieves a chat based on provided chat ID and user.
 * @param {Request} request Contains request info.
 * @param {Response} response Contains response info.
 * @param {NextFunction} next The function that will run after this middleware.
 */
const chatExtractor = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    const chatID = request.params.id;
    const user = request.user;

    const sbRes = await supabase
        .from("chats")
        .select("*")
        .eq("id", chatID)
        .limit(1)
        .single();

    if (!sbRes.data || sbRes.error)
        response.status(400).json({ error: "No chat found." });

    const chat = ChatSchema.parse(sbRes.data);

    if (chat.owner_id === user.id) {
        request.chat = chat;
        next();
    } else response.status(400).json({ error: "No chat found." });
};

/**
 * Retrieves a chat member based on provided chat ID and user.
 * @param {Request} request Contains request info.
 * @param {Response} response Contains response info.
 * @param {NextFunction} next The function that will run after this middleware.
 */
const chatMemberExtractor = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    const chatID = request.params.chatID;
    const user = request.user;

    const { data: member, error: memberError } = await supabase
        .from("chat_members")
        .select("user_id")
        .eq("user_id", user.id)
        .eq("chat_id", chatID)
        .limit(1)
        .single();

    if (!memberError && member) {
        next();
    } else response.status(400).json({ error: "No chat membership found." });
};

/**
 * Verifies Hcaptcha token.
 * @param {Request} request Contains request info.
 * @param {Response} response Contains response info.
 * @param {NextFunction} next The function that will run after this middleware.
 */
const hcaptchaVerifier = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    const token = z.string().parse(request.header("CACHAT-HCAPTCHA-TOKEN"));
    const params = new URLSearchParams();
    params.append("response", token);
    params.append("secret", HCAPTCHA_SECRET as string);

    const verifyRes = await axios.post(
        "https://api.hcaptcha.com/siteverify",
        params
    );
    const { success } = HCaptchaSchema.parse(verifyRes.data);

    if (success) next();
    else
        response.status(400).json({ error: "Invalid captcha token provided." });
};

/**
 * Verifies that a numeric pagination begin and end query parameters are
 * included in the request.
 * @param {Request} request Contains request info.
 * @param {Response} response Contains response info.
 * @param {NextFunction} next The function that will run after this middleware.
 */
const paginationVerifier = (
    request: Request,
    response: Response,
    next: NextFunction
): void => {
    if (request.query.begin && request.query.end) {
        request.begin = z.coerce.number().parse(request.query.begin);
        request.end = z.coerce.number().parse(request.query.end);
        next();
    } else
        response.status(400).json({
            error: "Missing pagination (begin or end parameters are undefined).",
        });
};

export {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    userExtractor,
    tokenExtractor,
    imageParser,
    fileExtractor,
    chatExtractor,
    chatMemberExtractor,
    hcaptchaVerifier,
    profileImgEditor,
    paginationVerifier,
};
