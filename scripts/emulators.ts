import { spawn } from "child_process";

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function startEmulators(): Promise<() => boolean> {
  const emulatorChildProcess = spawn("firebase", [
    "emulators:start",
    "--only",
    "firestore", // "auth,firestore",
    "--export-on-exit=./.firebaseEmulators/",
  ]);
  await sleep(10000);
  return () => emulatorChildProcess.kill("SIGINT");
}

export async function taskWithEmulatorsOn(
  asyncTask: () => Promise<unknown>,
): Promise<void> {
  const killEmulatorProc = await startEmulators();
  await asyncTask();
  killEmulatorProc();
}
