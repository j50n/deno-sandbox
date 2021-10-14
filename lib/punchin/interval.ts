export function format(seconds: number): string {
  function pad(n: number): string {
    let v = `${n}`;
    while (v.length < 2) {
      v = `0${v}`;
    }
    return v;
  }

  const sint = Math.floor(seconds);
  const mint = Math.floor(sint / 60);
  const m = mint % 60;
  const hint = Math.floor(mint / 60);
  const h = hint % 24;
  const d = Math.floor(hint / 24);

  const result = () => `${pad(h)}:${pad(m)}`;
  if (d > 0) {
    return `${d}:${result()}`;
  } else {
    return result();
  }
}

export function parseInterval(interval: string): number {
  return Number.parseFloat(interval) * 60 * 60 * 1000;
}
