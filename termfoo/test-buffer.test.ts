import { assertEquals } from "./deps/asserts.ts";
import { StringWriter } from "./deps/io.ts";
import { TextBuffer } from "./mod.ts";

Deno.test("TextBuffer.flush", async () => {
  const out = new StringWriter();
  const buff = new TextBuffer(out);

  buff.write("abc");
  assertEquals(
    out.toString(),
    "",
    "Prior to flush, no text should be written to the target writer.",
  );

  await buff.flush();

  assertEquals(
    out.toString(),
    "abc",
    "After flush, text should have been written to the target writer.",
  );
});

Deno.test("TextBuffer.flushSync", () => {
  const out = new StringWriter();
  const buff = new TextBuffer(out);

  buff.write("abc");
  assertEquals(
    out.toString(),
    "",
    "Prior to flush, no text should be written to the target writer.",
  );

  buff.flushSync();

  assertEquals(
    out.toString(),
    "abc",
    "After flush, text should have been written to the target writer.",
  );
});
Deno.test("TextBuffer.write", () => {
  const out = new StringWriter();
  const buff = new TextBuffer(out);

  buff.write("abc");
  buff.write("def");
  buff.flushSync();

  assertEquals(
    out.toString(),
    "abcdef",
    "I should get the text out exactly as I wrote it in.",
  );
});

Deno.test("TextBuffer.writeln", () => {
  const out = new StringWriter();
  const buff = new TextBuffer(out);

  buff.writeln("abc");
  buff.writeln("def");
  buff.flushSync();
  
  assertEquals(
    out.toString(),
    "abc\ndef\n",
    "Each writeln operation should end with a line-feed.",
  );
});
