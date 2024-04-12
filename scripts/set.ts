import { taskWithEmulatorsOn } from "./emulators";
import { seed } from "./execSeed";

taskWithEmulatorsOn(seed)
  .then(() => {
    console.log("done");
  })
  .catch(console.error);
