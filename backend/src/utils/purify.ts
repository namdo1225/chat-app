import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

export const JSDOM_WINDOW = new JSDOM("").window;
export const DOM_PURIFY = createDOMPurify(window);
