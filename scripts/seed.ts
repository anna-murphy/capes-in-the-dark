import fs from "node:fs";
import { Timestamp } from "firebase-admin/firestore";

import { firestore, storage } from "./utils/firebaseEmulators";

const FEEDS_COLLECTION = firestore
  .collection("api")
  .doc("v1")
  .collection("feeds");
const EPISODES_COLLECTION = firestore
  .collection("api")
  .doc("v1")
  .collection("episodes");

const CAPES_IN_THE_WEST_MARCH_FEED: PodcastChannel = {
  title: "Capes in the West March",
  description:
    "An Actual Play Archive of RAW Audio recordings of our Capes in the West March game.",
  feedUrl: "https://capes-in-the-dark.web.app/capes-in-the-west-march/rss",
  image:
    "https://capes-in-the-dark.web.app/images/Capes_in_the_West_March_Image.png",
  contact: {
    site: "https://capes-in-the-dark.web.app",
    author: "Anna Murphy",
    owner: "Anna Murphy",
    email: "curunilauro@gmail.com",
  },
  metadata: {
    type: "serial",
    locked: "no",
    complete: "no",
    categories: [
      { category: "Fiction" },
      { category: "Leisure", subCategory: "Games" },
    ],
    language: "en-us",
    explicit: true,
  },
};

const CITWM_EPISODE: PodcastEpisode = {
  feed: "Capes in the West March",
  title: "Example Episode",
  description: "A given description",
  publishDate: Timestamp.fromDate(new Date()) as unknown as Date,
  imageLink:
    "https://capes-in-the-dark.web.app/images/Capes_in_the_West_March_Image.png",
  metadata: {
    season: 0,
    episode: 1,
    // transcriptUrl: undefined,
    type: "full",
    explicit: false,
  },
  fileData: {
    url: "",
    size: 0,
    duration: 204,
  },
};

async function uploadDataToStorage(
  bucket: string,
  fileName: string,
  path: string,
): Promise<ReturnType<ReturnType<typeof storage.bucket>["file"]>> {
  return await new Promise((resolve, reject) => {
    const fileRef = storage.bucket(bucket).file(fileName);
    fs.createReadStream(path)
      .pipe(fileRef.createWriteStream())
      .on("error", (error) => {
        reject(error.message);
      })
      .on("finish", () => {
        resolve(fileRef);
      });
  });
}

async function seedEpisode(): Promise<void> {
  const fileRef = await uploadDataToStorage(
    "gs://capes-in-the-dark.appspot.com",
    "audio.mp3",
    "./scripts/data/audio.mp3",
  );
  const metadata = await fileRef.getMetadata();
  const { size, mediaLink } = metadata[0];
  CITWM_EPISODE.fileData.size = Number(size);
  CITWM_EPISODE.fileData.url = mediaLink ?? "";
  await EPISODES_COLLECTION.add(CITWM_EPISODE);
}

export async function seed(): Promise<void> {
  await FEEDS_COLLECTION.add(CAPES_IN_THE_WEST_MARCH_FEED);
  await seedEpisode();
}

seed()
  .then(() => {
    console.log("done");
  })
  .catch(console.error);
