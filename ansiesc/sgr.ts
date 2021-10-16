/** The ANSI escape sequence. */
export const ESC = "\u001B[";

/** All attributes off */
export const RESET = `${ESC}0m`;

/** Bold or increased intensity. As with faint, the color change is a PC (SCO/CGA) invention. */
export const BOLD = `${ESC}1m`;

/** Faint, decreased intensity, or dim. May be implemented as a light font weight like bold. */
export const FAINT = `${ESC}2m`;

/** Italic. Not widely supported. Sometimes treated as inverse or blink. */
export const ITALIC = `${ESC}3m`;

/** Underline. Style extensions exist for Kitty, VTE, mintty and iTerm2. */
export const UNDERLINE = `${ESC}4m`;

/** Slow blink. Less than 150 per minute. */
export const BLINK = `${ESC}5m`;

/** Rapid blink. MS-DOS ANSI.SYS, 150+ per minute; not widely supported. */
export const RAPIDBLINK = `${ESC}6m`;

/** Reverse video or invert. Swap foreground and background colors; inconsistent emulation. */
export const INVERT = `${ESC}7m`;
