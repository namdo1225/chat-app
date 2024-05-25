/**
 * Provides /health_check route to check API's health.
 */

import "express-async-errors";
import { Router } from "express";

const router = Router();

router.get("/", (_request, response) => {
    response.status(200).json({});
});

export default router;
