import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import istanbul from "vite-plugin-istanbul";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tsconfigPaths(),
        /*istanbul({
            cypress: true,
            requireEnv: false,
        }),*/
    ],
    server: {
        host: true,
        port: 5173,
    },
});
