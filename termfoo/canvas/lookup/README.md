# Lookup Tables

In general, I don't want to work with strings in an animation library. There is
a lot of overhead that comes with string concatenation and conversion. This
isn't normally a problem, but this needs to be as fast as possible. I want to
work with byte buffers.

`Uint8Array` instances can be directly concatenated to other `Uint8Array`
instances. This is a super-fast operation, as it is just copying a small number
of bytes on each operation and updating a counter. The entire buffer rarely has
to be copied (sometimes on a resize), unlike string data which has to be copied
on each concatenation (although joining an array can get around this). This also
neatly avoids the whole issue of converting character values to bytes
repetitively, needlessly.

This technique is really fast. Like "approaching C" fast. I am able to load up
the buffer for a screen with a few dozen simple sprites, diff with the previous
screen, and apply the changes to the standard Linux terminal in just a few
milliseconds. I am shooting for 16 milliseconds (60 frames per second), so this
leaves plenty of time for game logic.

## Squots

Squots are a 6-bit (64 char) character mapping that originally appeared on the
TRS-80. Squots map a character to 6 pixels, arranged at 2 pixels in the X
direction and 3 pixels in the Y direction. Each pixel is roughly square if you
squint a little.

In the modern era, squot characters are mapped into Unicode. Each character is
represented by multiple bytes in UTF-8, which is what the terminal understands.

The addition of squots to the Unicode standard is fairly recent, and not all
terminals support them. Where they are supported, they can be used to create
some very nice effects.

## Colors

Most terminals support an 8-bit color scheme. This is 256 colors arranged as
follows.

- _First 16_: The standard 16 colors.
- _Next 216_: A 6x6x6 color cube (RGB)
- _Final 24_: 24 shades of gray, from black to white

The consumer of `Console` can pick from any of these colors for background and
foreground colors.

See [ANSI Escape Codes](https://en.wikipedia.org/wiki/ANSI_escape_code), **8-Bit
Colors** section.
