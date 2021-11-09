import { SQUOTS } from "../squots.ts";

SQUOTS.forEach((squot, i) => {
  console.log(`${i}: ${new TextDecoder().decode(squot)}`);
});
