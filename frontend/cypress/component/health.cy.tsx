import React from "react";
import App from "../../src/App";
import { mount } from "@cypress/react18";

describe("<App>", () => {
    it("mounts", () => {
        mount(<App />);
    });
});
