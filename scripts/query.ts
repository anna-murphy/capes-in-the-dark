import { firestore } from "./utils/firebaseProduction";

async function main(): Promise<void> {
  const rssDocs = await firestore
    .collection("api/v1/rss")
    .where("feed", "==", "Capes in the West March")
    .orderBy("timestamp", "desc")
    .get();
  for (const doc of rssDocs.docs) {
    console.log(doc.data());
  }
}

main()
  .then(() => {
    console.log("done");
  })
  .catch(console.error);
