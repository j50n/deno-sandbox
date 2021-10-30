import { AsyncIter } from "https://deno.land/x/asynciter@0.0.5/mod.ts";
import {
  BufReader,
  BufWriter,
} from "https://deno.land/std@0.113.0/io/bufio.ts";
import { TextProtoReader } from "https://deno.land/std@0.113.0/textproto/mod.ts";

const encoder = new TextEncoder();
const LF = encoder.encode("\n");

/** Parameters for {@link AsyncIter4Sh.pipe()}. */
interface ShPipedParams {
  /** The command. */
  cmd: string[] | [URL, ...string[]];
  /** Optional environment definition. */
  env?: { [key: string]: string };
}

/** Parameters for {@link sh()}. */
interface ShParams extends ShPipedParams {
  /** Optional stdin. */
  stdin?: AsyncIterable<string>;
}

export class AsyncIter4Sh extends AsyncIter<string> {
  /**
   * Constructor.
   * @param iterator The wrapped iterator.
   */
  constructor(iterator: AsyncIterable<string> | Array<string>) {
    super(iterator);
  }

  public pipe(params: ShPipedParams): AsyncIter4Sh {
    return sh({ ...params, stdin: this });
  }
}

/**
 * ### Example
 * ````typescript
 * for await (const line of sh({cmd: ["ls", "-la"]})){
 *   console.log(line);
 * }
 * ````
 * @param params Parameters.
 */
export function sh(params: ShParams): AsyncIter4Sh {
  return new AsyncIter4Sh(shinner(params));
}

async function* shinner(params: ShParams): AsyncIterableIterator<string> {
  const { cmd, env, stdin } = params;
  const proc = Deno.run({
    cmd,
    env,
    stdin: stdin ? "piped" : undefined,
    stdout: "piped",
    stderr: "inherit",
  });

  let inputDriver;
  if (stdin) {
    inputDriver = (async () => {
      if (proc.stdin == null) {
        throw new Error("missing expected stdin");
      }
      const bw = new BufWriter(proc.stdin);
      try {
        for await (const lineIn of stdin) {
          await bw.write(encoder.encode(lineIn));
          await bw.write(LF);
        }
      } finally {
        await bw.flush();
        await proc.stdin.close();
      }
    })();
  }

  const stdout = new TextProtoReader(new BufReader(proc.stdout));

  try {
    while (true) {
      const line = await stdout.readLine();
      if (line == null) {
        break;
      } else {
        yield line;
      }
    }
  } finally {
    await proc.stdout.close();
  }

  const status = await proc.status();
  if (!status.success) {
    throw new Error(`process returned error code: ${status.code}`);
  }

  if (inputDriver) {
    await inputDriver;
  }

  await proc.close();
}
