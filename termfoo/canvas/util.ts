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

export function uint32Array(n: number, value: number): Uint32Array {
  const arr = new Uint32Array(n);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = value;
  }
  return arr;
}

export function concatUint8Arrays(...arr: Uint8Array[]): Uint8Array {
  const totalLength = arr.map((a) => a.length).reduce((a, b) => a + b, 0);

  const result = new Uint8Array(totalLength);

  let current = 0;
  for (const a of arr) {
    result.set(a, current);
    current += a.length;
  }

  return result;
}
