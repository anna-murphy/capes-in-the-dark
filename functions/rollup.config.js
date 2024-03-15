import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  plugins: [typescript({ rootDir: "src" })],
  external: [
    "firebase-functions/v1",
    "firebase-functions/logger",
    "firebase-functions/v2/firestore",
    "firebase-functions/v2/storage",
    "firebase-functions/v2/scheduler",
    "firebase-functions/v2/https",
    "firebase-admin",
    "firebase-admin/storage",
    "firebase-admin/app",
    "firebase-admin/firestore",
    "express"
  ],
  output: {
    dir: "lib",
    format: "cjs",
    sourcemap: true,
  },
};
