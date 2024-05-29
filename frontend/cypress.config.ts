import { defineConfig } from "cypress";
import codeCoverage from "@cypress/code-coverage/task";

export default defineConfig({
    env: {
        codeCoverage: {
            exclude: "cypress/**/*.*",
        },
    },
    e2e: {
        baseUrl: "http://localhost:5173",
    },
    component: {
        devServer: {
            framework: "react",
            bundler: "vite",
        },
        setupNodeEvents(on, config) {
            codeCoverage(on, config);

            return config;
        },
    },
});
