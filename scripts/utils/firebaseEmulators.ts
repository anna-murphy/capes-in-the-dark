import admin from "firebase-admin";

process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
process.env.GCLOUD_PROJECT = "capes-in-the-dark";
process.env.FIREBASE_STORAGE_EMULATOR_HOST = "127.0.0.1:9199";

export const app = admin.initializeApp({ projectId: "capes-in-the-dark" });
export const firestore = admin.firestore(app);
export const storage = admin.storage(app);
export const auth = admin.auth(app);
