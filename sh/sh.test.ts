import { sh } from "./sh.ts";
import { asyncIter } from "https://deno.land/x/asynciter@0.0.5/mod.ts";

Deno.test("sh", async () => {
  for await (
    const line of sh({
      stdin: asyncIter(["a", "b", "c"]),
      cmd: ["wc", "-l"],
    })
  ) {
    console.log(`***${line}***`);
  }
});
