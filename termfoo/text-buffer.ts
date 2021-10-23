import { StringWriter } from "./deps/io.ts";

const encoder = new TextEncoder();
const LF: Uint8Array = encoder.encode("\n");

/**
 * A simple buffer for text.
 *
 * Allows you to write text to a buffer. When you have written everything, you can flush to write it to
 * the writer all at once.
 *
 * Lots of small updates really slow down the performance of some terminal emulators. This lets you control
 * when you write and how much data you dump at once, and that should make your terminal happy.
 */
export class TextBuffer {
  private buffer: StringWriter = new StringWriter();

  /**
   * Constructor.
   * @param writer The target writer.
   */
  constructor(private writer: Deno.Writer & Deno.WriterSync) {
  }

  /**
   * Flush the contents of the buffer.
   */
  public async flush(): Promise<void> {
    const text = this.buffer.toString();
    this.buffer = new StringWriter();
    await this.writer.write(encoder.encode(text));
  }

  /**
   * Flush the contents of the buffer.
   */
  public flushSync(): void {
    const text = this.buffer.toString();
    this.buffer = new StringWriter();
    this.writer.writeSync(encoder.encode(text));
  }

  /**
   * Write text to the internal buffer.
   * @param text Text to write.
   */
  public write(text: string): void {
    this.buffer.writeSync(encoder.encode(text));
  }

  /**
   * Write a line of text to the internal buffer.
   * @param text Text to write.
   */
  public writeln(text?: string): void {
    if(text !== null){
    this.buffer.writeSync(encoder.encode(text));
    }
    this.buffer.writeSync(LF);
  }
}
