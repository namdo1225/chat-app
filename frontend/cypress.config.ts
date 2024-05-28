import { defineConfig } from "cypress";

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
        /*setupNodeEvents(on, config) {
            require("@cypress/code-coverage/task")(on, config);

            return config;
        },*/
    },
});
