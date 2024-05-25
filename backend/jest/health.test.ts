import { describe, test } from "@jest/globals";
import request from "supertest";
import app from "../src/expressApp";

describe("Health Check Tests", () => {
    test("Expects 200 OK", () => {
        request(app)
            .get("/health_check")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, _res) {
                if (err) throw err;
            });
    });
});
