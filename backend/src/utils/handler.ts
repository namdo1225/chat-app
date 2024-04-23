import { Request } from "express";
import { FileFilterCallback } from "multer";
import { extname } from "path";

export const fileResultHandler = (err: NodeJS.ErrnoException | null): void => {
    if (err) {
        console.log("unlink failed", err);
    } else {
        console.log("file deleted");
    }
};

export const fileImageHandler =
(_: Request, file: Express.Multer.File, callback: FileFilterCallback):
void => {
    const ext = extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
        return callback(new Error('Only images with extensions .png, .jpg, or .jpeg are allowed'));
    }
    callback(null, true);
};