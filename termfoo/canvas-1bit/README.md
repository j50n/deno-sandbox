## Colors

The canvas supports 3/4 bit colors, 8-bit colors, and 24-bit colors for both
foreground and background.

3/4 bit colors are encoded as 0-7 for normal colors and 8-15 for bright colors.

For 8-bit colors, the 6x6x6 color cube and greyscale are mapped to the spec
values, 16 to 255.

For 24-bit colors, I use a 32 bit value and set the upper byte to 0x01 to mark
the value for special handling. To create these numbers, either use `color24()`
to generate the value based on red, green, and blue components, or be aware that
you have to set a 0x01 into the upper byte.

I am not seeing a performance penalty or advantage for using different color
schemes. 24-bit colors are just as fast as 3/4 bit colors. Use whatever you
want. It doesn't matter.
