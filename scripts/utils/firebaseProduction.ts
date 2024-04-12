import admin, { type ServiceAccount } from "firebase-admin";
import serviceAccount from "../../credentials/serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  projectId: "capes-in-the-dark",
});

admin.initializeApp({ projectId: "capes-in-the-dark" });

export const firestore = admin.firestore();
export const storage = admin.storage();
export const auth = admin.auth();
