import { seed } from "./execSeed";

seed()
  .then(() => {
    console.log("done");
  })
  .catch(console.error);
