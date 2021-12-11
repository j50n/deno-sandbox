import { isEven } from "./util.ts";
import { assert } from "../deps/asserts.ts";
Deno.test("check evenness of negative numbers", () => {
  assert(isEven(-2), "-2 is an even number");
  assert(!isEven(-1), "-1 is an odd number");
});

Deno.test("check evenness of positive numbers", () => {
  assert(isEven(2), "2 is an even number");
  assert(!isEven(1), "1 is an odd number");
});

Deno.test("check zero is an even number", () => {
  assert(isEven(0), "0 is an even number");
});
