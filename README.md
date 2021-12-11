# deno-sandbox

This is just a scratch project I am using to play around with `deno`. If it
turns into anything, it will be migrated to a proper project.

## Invaders Demo

This is a work in progress, and I probably won't turn it into a real game due to
limitations on terminal input. This demonstrates the ability to animate multiple
objects in a terminal at 60 frames per second with plenty of room to spare.

```sh
deno --unstable run --allow-net=github.com,raw.githubusercontent.com https://raw.githubusercontent.com/j50n/deno-sandbox/main/invaders/invaders.ts
```

**Note:** Deno applications are secure by default. See
[Sandboxing in Deno](https://medium.com/deno-the-complete-reference/sandboxing-in-deno-b3d514d88b63).
It is safe to run this application like this because you are not giving it any
extra permissions.
