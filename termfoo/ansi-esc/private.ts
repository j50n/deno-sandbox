import { ESC } from "./common.ts";

/** Show the cursor. */
export const SHOW_CURSOR = `${ESC}?25h`;

/** Hide the cursor. */
export const HIDE_CURSOR = `${ESC}?25l`;
