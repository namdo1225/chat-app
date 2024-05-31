

import { describe, test } from "@jest/globals";
import request from "supertest";
import { info } from "../src/utils/logger";

describe("Utils Check Tests", () => {
    test("logger()", () => {
        console.log = jest.fn();
        info('hello');
        expect(console.log).toHaveBeenCalledWith('hello');
    });
});
