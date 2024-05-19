import { PaletteColor, SimplePaletteColorOptions } from "@mui/material";
import { blue, blueGrey } from "@mui/material/colors";

declare module "@mui/material/styles" {
    interface BreakpointOverrides {
        hcaptcha: true; // adds the `mobile` breakpoint
    }
}

declare module "@mui/material/styles" {
    interface Palette {
        footer: PaletteColor;
    }

    interface PaletteOptions {
        footer: SimplePaletteColorOptions;
    }
}

export const THEME_VALUES = {
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
            hcaptcha: 350,
        },
    },
};

export const LIGHT_THEME_COLORS = {
    palette: {
        type: "light",
        footer: { main: blue[500] },
    },
};

export const DARK_THEME_COLORS = {
    palette: {
        type: "dark",
        footer: { main: blueGrey[900] },
    },
};

export const PALETTE_COLORS = [
    "primary.main",
    "primary.light",
    "primary.dark",
    "secondary.main",
    "secondary.light",
    "secondary.dark",
    "warning.main",
    "warning.light",
    "warning.dark",
    "info.main",
    "info.light",
    "info.dark",
    "error.main",
    "error.light",
    "error.dark",
    "success.main",
    "success.light",
    "success.dark",
    "black",
    "white"
] as const;


export type PaletteColors = (typeof PALETTE_COLORS)[number];

export const CHAT_THEMES_KEY = [
    "fromMessageBox",
    "toMessageBox",
    "fromMessageText",
    "toMessageText"
] as const;

export type ChatThemeKey = (typeof CHAT_THEMES_KEY)[number];

export interface ChatMessageTheme {
    fromMessageBox: PaletteColors;
    toMessageBox: PaletteColors;
    fromMessageText: PaletteColors | undefined;
    toMessageText: PaletteColors | undefined;
};