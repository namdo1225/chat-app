import { describe, test } from "@jest/globals";
import request from "supertest";
import app from "../src/expressApp";

describe("Health Check Tests", () => {
    test("Expects 200 OK", async () => {
        await request(app)
            .get("/health_check")
            .expect("Content-Type", /json/)
            .expect(200);
    });
});
