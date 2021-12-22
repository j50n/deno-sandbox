export function mirror(def: string[]): string[] {
  return def.map((d) => d.split("").reverse().join(""));
}
