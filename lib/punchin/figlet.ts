export async function figlet(
  text: string,
  font?: string | undefined,
  center?: boolean | undefined,
): Promise<string> {
  const { columns } = Deno.consoleSize(Deno.stdout.rid);
  const command: string[] = ["figlet", "-w", `${columns}`];
  if (font !== undefined) {
    command.push("-f", font);
  }
  if (center === true) {
    command.push("-c");
  }
  command.push(text);

  const p = Deno.run({
    cmd: command,
    stdout: "piped",
  });

  const { code } = await p.status();

  if (code === 0) {
    return new TextDecoder().decode(await p.output());
  } else {
    throw new Error(`figlet exited with error code ${code}`);
  }
}
