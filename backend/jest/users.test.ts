/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { describe, test } from "@jest/globals";
import request from "supertest";
import app from "../src/app";
import { JEST_HCAPTCHA_TOKEN } from "./config";
import path from "path";
import redisClient from "../src/utils/redis";
import { server } from "../src/homeWS";

describe("/users POST route", () => {
    afterAll(async () => {
        await request(app).delete("/wipe").expect(200);
        await redisClient.disconnect();
        server.close();
    });

    test("Expects 201 - Account created successfully.", async () => {
        await request(app)
            .post("/users")
            .field("first_name", "Test")
            .field("last_name", "Users")
            .field("email", "email01@doesnotexist.com")
            .field("password", "94321KJEkfewI!932kaKLan")
            .set("CACHAT-HCAPTCHA-TOKEN", JEST_HCAPTCHA_TOKEN)
            .expect(201);

        await request(app).delete("/wipe").expect(200);
    });

    test("Expects 201 - Account w/ photo created successfully.", async () => {
        await request(app)
            .post("/users")
            .field("first_name", "Test")
            .field("last_name", "Users")
            .field("email", "email02@doesnotexist.com")
            .field("password", "94321KJEkfewI!932kaKLan")
            .field("x", 0.08333333333333331)
            .field("y", 0.11111111111111116)
            .field("width", 0.8333333333333334)
            .field("height", 0.7777777777777777)
            .attach("photo", path.resolve(__dirname, "./assets/profile.png"))
            .set("CACHAT-HCAPTCHA-TOKEN", JEST_HCAPTCHA_TOKEN)
            .expect(201);

        await request(app).delete("/wipe").expect(200);
    });
});
