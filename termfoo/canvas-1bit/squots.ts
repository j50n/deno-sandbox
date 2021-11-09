import { assert } from "../deps/asserts.ts";

const SQUOT_CHARS = [
  /* 000000 */ "\u{20}",
  /* 000001 */ "\u{1fb00}",
  /* 000010 */ "\u{1fb01}",
  /* 000011 */ "\u{1fb02}",
  /* 000100 */ "\u{1fb03}",
  /* 000101 */ "\u{1fb04}",
  /* 000110 */ "\u{1fb05}",
  /* 000111 */ "\u{1fb06}",
  /* 001000 */ "\u{1fb07}",
  /* 001001 */ "\u{1fb08}",
  /* 001010 */ "\u{1fb09}",
  /* 001011 */ "\u{1fb0a}",
  /* 001100 */ "\u{1fb0b}",
  /* 001101 */ "\u{1fb0c}",
  /* 001110 */ "\u{1fb0d}",
  /* 001111 */ "\u{1fb0e}",
  /* 010000 */ "\u{1fb0f}",
  /* 010001 */ "\u{1fb10}",
  /* 010010 */ "\u{1fb11}",
  /* 010011 */ "\u{1fb12}",
  /* 010100 */ "\u{1fb13}",
  /* 010101 */ "\u{258c}",
  /* 010110 */ "\u{1fb14}",
  /* 010111 */ "\u{1fb15}",
  /* 011000 */ "\u{1fb16}",
  /* 011001 */ "\u{1fb17}",
  /* 011010 */ "\u{1fb18}",
  /* 011011 */ "\u{1fb19}",
  /* 011100 */ "\u{1fb1a}",
  /* 011101 */ "\u{1fb1b}",
  /* 011110 */ "\u{1fb1c}",
  /* 011111 */ "\u{1fb1d}",
  /* 100000 */ "\u{1fb1e}",
  /* 100001 */ "\u{1fb1f}",
  /* 100010 */ "\u{1fb20}",
  /* 100011 */ "\u{1fb21}",
  /* 100100 */ "\u{1fb22}",
  /* 100101 */ "\u{1fb23}",
  /* 100110 */ "\u{1fb24}",
  /* 100111 */ "\u{1fb25}",
  /* 101000 */ "\u{1fb26}",
  /* 101001 */ "\u{1fb27}",
  /* 101010 */ "\u{2590}",
  /* 101011 */ "\u{1fb28}",
  /* 101100 */ "\u{1fb29}",
  /* 101101 */ "\u{1fb2a}",
  /* 101110 */ "\u{1fb2b}",
  /* 101111 */ "\u{1fb2c}",
  /* 110000 */ "\u{1fb2d}",
  /* 110001 */ "\u{1fb2e}",
  /* 110010 */ "\u{1fb2f}",
  /* 110011 */ "\u{1fb30}",
  /* 110100 */ "\u{1fb31}",
  /* 110101 */ "\u{1fb32}",
  /* 110110 */ "\u{1fb33}",
  /* 110111 */ "\u{1fb34}",
  /* 111000 */ "\u{1fb35}",
  /* 111001 */ "\u{1fb36}",
  /* 111010 */ "\u{1fb37}",
  /* 111011 */ "\u{1fb38}",
  /* 111100 */ "\u{1fb39}",
  /* 111101 */ "\u{1fb3a}",
  /* 111110 */ "\u{1fb3b}",
  /* 111111 */ "\u{2588}",
] as const;

assert(SQUOT_CHARS.length === 64, "there are exactly 64 squots");

/**
 * Six pixels mapped onto a single width character; upper left is low pixel; mapped over 0 to 64 (6 bits).
 *
 * Each character is mapped to {@link Uint8Array} as this is expected to be the normal use case.
 */
export const SQUOTS: readonly Uint8Array[] = SQUOT_CHARS.map((c) =>
  new TextEncoder().encode(c)
);
