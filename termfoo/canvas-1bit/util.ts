export function isEven(n: number): boolean {
  return n % 2 === 0;
}

/**
 * If a number is odd, make it even by adding one.
 * @param n A number.
 * @returns The number, or the number plus 1, guaranteed to be even.
 */
export function makeEven(n: number): number {
  if (isEven(n)) {
    return n;
  } else {
    return n + 1;
  }
}
