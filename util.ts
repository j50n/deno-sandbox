/**
 * True remainder after division (handles negatives correctly).
 * @param numerator
 * @param denominator
 * @returns The remainder after the division.
 */
export function rem(numerator: number, denominator: number): number {
  if (numerator < 0.0) {
    return ((numerator % denominator) + denominator) % denominator;
  } else {
    return numerator % denominator;
  }
}

/**
 * Sleep for a while.
 * @param delayms Delay in milliseconds.
 */
export async function sleep(delayms: number): Promise<void> {
  await new Promise<void>((resolve, _reject) =>
    setTimeout(() => resolve(), delayms)
  );
}
