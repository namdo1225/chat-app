import { Request } from "express";
import { FileFilterCallback } from "multer";
import { extname } from "path";
import { logError } from "./logger";

/**
 * A result handler for file parsing.
 * @param {NodeJS.ErrnoException | null} err The
 * error of the file result parsing.
 */
export const fileResultHandler = (err: NodeJS.ErrnoException | null): void => {
    if (err) logError("unlink failed", err);
};

/**
 * Checks image file extension.
 * @param {Express.Multer.File} file The image file to check.
 * @param {FileFilterCallback} callback The callback if the file
 * extension does not pass the check.
 */
export const fileImageHandler = (
    _: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
): void => {
    const ext = extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
        return callback(
            new Error(
                "Only images with extensions .png, .jpg, or .jpeg are allowed"
            )
        );
    }
    callback(null, true);
};
