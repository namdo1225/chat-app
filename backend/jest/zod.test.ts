/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { describe, test } from "@jest/globals";
import request from "supertest";
import app from "../src/app";
import { JEST_HCAPTCHA_TOKEN } from "./config";
import redisClient from "../src/utils/redis";
import { server } from "../src/homeWS";

describe("zod Error handling Check", () => {
    afterAll(async () => {
        await request(app).delete("/wipe").expect(200);
        await redisClient.disconnect();
        server.close();
    });

    test("Expects 400 - Parsing error", async () => {
        const payload = { email: "xyz@sadfjak.com" };

        const respone = await request(app)
            .post("/contact")
            .send(payload)
            .set("CACHAT-HCAPTCHA-TOKEN", JEST_HCAPTCHA_TOKEN)
            .expect(400);

        expect(respone.body.error).toBeDefined();
    });
});
