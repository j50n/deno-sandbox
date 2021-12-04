export function isEven(n: number): boolean {
  return n % 2 === 0;
}

export function isDivisibleBy3(n: number): boolean {
  return n % 3 === 0;
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

export function makeDivisibleBy3(n: number): number {
  if (isDivisibleBy3(n)) {
    return n;
  } else {
    return makeDivisibleBy3(n + 1);
  }
}

export function uint8Array(n: number, value: number): Uint8Array {
  const arr = new Uint8Array(n);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = value;
  }
  return arr;
}
