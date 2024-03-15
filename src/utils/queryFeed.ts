import {
  Timestamp,
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../firebase";

export async function assembleFeedData(
  feedName: string,
): Promise<{ feed: PodcastChannel; episodes: PodcastEpisode[] } | undefined> {
  try {
    const feed = await queryFeed(feedName);
    const episodes = await queryEpisodes(feedName);
    return { feed, episodes };
  } catch (ex) {
    console.error(ex);
    throw ex;
  }
}

export async function queryFeed(feedName: string): Promise<PodcastChannel> {
  const queryResult = query(
    collection(firestore, "api/v1/feeds"),
    where("title", "==", feedName),
    limit(1),
  );
  const docs = await getDocs(queryResult);
  if (docs.size !== 1 || !docs.docs[0].exists())
    throw new Error(`Feed "${feedName}" not found.`);
  return docs.docs[0].data() as PodcastChannel;
}

export async function queryEpisodes(
  feedName: string,
): Promise<PodcastEpisode[]> {
  const queryResult = query(
    collection(firestore, "api/v1/episodes"),
    where("feed", "==", feedName),
  );
  const docs = await getDocs(queryResult);
  if (docs.size === 0)
    throw new Error(`No episodes have been registered for feed "${feedName}".`);
  const episodes: PodcastEpisode[] = [];
  docs.forEach((document) => {
    const episodeData = document.data() as PodcastEpisode;
    // Episode publication dates are stored as FB timestamps for query
    // purposes. These need to be converted back to JS dates to assemble
    // the RSS feed.
    const publishData: Timestamp =
      episodeData.publishDate as unknown as Timestamp;
    episodeData.publishDate = new Timestamp(
      publishData.seconds,
      publishData.nanoseconds,
    ).toDate();
    episodes.push(episodeData);
  });
  return episodes;
}
