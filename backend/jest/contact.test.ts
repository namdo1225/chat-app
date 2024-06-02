/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { describe, test } from "@jest/globals";
import request from "supertest";
import app from "../src/app";
import { JEST_HCAPTCHA_TOKEN } from "./config";

describe("/contact route", () => {
    test("Expects 200 OK - Sends email successfully", async () => {
        const payload = { email: "xyz@sadfjak.com", body: "HEllo!" };

        const respone = await request(app)
            .post("/contact")
            .send(payload)
            .set("CACHAT-HCAPTCHA-TOKEN", JEST_HCAPTCHA_TOKEN)
            .expect(200);

        expect(respone.body.message).toBeDefined();
        expect(respone.body.message).toBe("Contact email sent successfully.");
    });

    test("Expects 500 - Email sent failed", async () => {
        const payload = {
            email: "xyz@sadfjak.com",
            body: "HEllo!",
            _fail: true,
        };

        const respone = await request(app)
            .post("/contact")
            .send(payload)
            .set("CACHAT-HCAPTCHA-TOKEN", JEST_HCAPTCHA_TOKEN)
            .expect(500);

        expect(respone.body.error).toBeDefined();
        expect(respone.body.error).toBe(
            "Unknown error while trying to send contact email."
        );
    });
});
