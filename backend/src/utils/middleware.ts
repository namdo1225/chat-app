import "express-async-errors";
import { info, logError } from "./logger";
import { NextFunction, Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import { fileImageHandler } from "@/utils/handler";
import { supabase } from "@/supabase";
import { HCaptchaSchema } from "@/types/zod";
import { ChatsSchema } from "@/types/chat";
import { UserChangeSchema } from "@/types/user";
import axios from "axios";
import { HCAPTCHA_SECRET, PROFILE_WIDTH_HEIGHT } from "./config";
import { z } from "zod";
import { createReadStream } from "streamifier";

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
    } else if (error.name === "MulterError") {
        response.status(400).json({ error: error.message });
    } else if (error.name === "ZodError") {
        response.status(400).json(JSON.parse(error.message));
    } else next(error);
};

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
    } else response.status(400).json({ error: "No user found" });
};

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
        response.status(400).json({ error: "No bearer access token provided" });
};

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: fileImageHandler,
    limits: { fileSize: 50_000 /* 50 KB */ },
});

const imageParser = upload.single("photo");

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
            const left = Math.floor(x * PROFILE_WIDTH_HEIGHT);
            const top = Math.floor(y * PROFILE_WIDTH_HEIGHT);

            const buffer = await sharp(file.buffer)
                .extract({
                    left,
                    top,
                    width: Math.floor(width * 200),
                    height: Math.floor(height * 200),
                })
                .resize(PROFILE_WIDTH_HEIGHT, PROFILE_WIDTH_HEIGHT)
                .toFormat("jpg")
                .jpeg({ quality: 95, force: true })
                .toBuffer();
            request.fileData = createReadStream(buffer);
            request.fileExtension = "jpg";
            next();
        }
    } else next();
};

const chatExtractor = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    const chatID = request.params.id;
    const user = request.user;

    const { data } = await supabase.from("chats").select("*").eq("id", chatID);
    const chats = ChatsSchema.parse(data);

    if (
        chats.length === 1 &&
        chats[0].owner_id &&
        chats[0].owner_id === user.id
    ) {
        request.chat = chats[0];
        next();
    } else response.status(400).json({ error: "No chat found." });
};

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
    else {
        response.status(400).json({ error: "Invalid captcha token provided." });
    }
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
    hcaptchaVerifier,
    profileImgEditor,
};
