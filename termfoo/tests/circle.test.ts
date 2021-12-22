Deno.test("circle", () => {
  for (let t = 0; t <= 1; t += 1 / 16) {
    const tsq = t * t;

    console.log(`${t} x:${(1 - tsq) / (1 + tsq)}, y:${2 * t / (1 + tsq)}`);
  }
});
