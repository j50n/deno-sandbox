#!/usr/bin/env -S deno run --allow-run

import { sleep } from "../util.ts";
import { AsyncIter4Sh } from "../sh.ts";

console.dir(Deno.resources());

await new AsyncIter4Sh(["a", "b", "c", "d", "e"]).pipe({
  cmd: ["grep", "-P", "^[abc]$"],
})
  .pipe({ cmd: ["wc", "-l"] }).forEach((line) => console.log(line));
console.log(
  await new AsyncIter4Sh(["a", "b", "c", "d", "e"]).pipe({
    cmd: ["grep", "-P", "^[abc]$"],
  })
    .pipe({ cmd: ["head", "-n", "1"] }).forEach((line) => console.log(line)),
);

while (true) {
  await sleep(1000);
  console.dir(Deno.resources());
}
