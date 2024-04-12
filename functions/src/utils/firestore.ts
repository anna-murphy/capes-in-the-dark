import { initializeApp } from "firebase-admin";
import { Timestamp, getFirestore } from "firebase-admin/firestore";
import {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from "firebase-functions/v2/firestore";
import { PodcastChannel, PodcastEpisode, RssDocument } from "./types";

initializeApp();
const db = getFirestore();

/**
 * Wrapper function to get the firestore db.
 * @returns {FirebaseFirestore.Firestore}
 */
export function getFirestoreDb() {
  return db;
}

export async function queryEpisodeByFeed(feed: string) {
  const db = getFirestoreDb();
  const episodes = await db
    .collection("api/v1/episodes")
    .where("feed", "==", feed)
    .get();
  return episodes.docs.map((doc) => doc.data() as PodcastEpisode);
}

export async function queryFeed(feed: string) {
  const db = getFirestoreDb();
  const results = await db
    .collection("api/v1/feeds")
    .where("title", "==", feed)
    .limit(1)
    .get();
  if (results.size === 1) return results.docs[0].data() as PodcastChannel;
  throw new Error(`Unable to find feed "${feed}"`);
}

/**
 * Saves a new document with the whole RSS feed for a given feed.
 * @param data string form of RSS data
 */
export async function saveFeed(feed: string, data: string) {
  const db = getFirestoreDb();
  return db.collection("api/v1/rss").add({
    feed,
    rss: data,
    timestamp: Timestamp.now(),
  });
}

export async function getMostRecentRss(feed: string) {
  const db = getFirestoreDb();
  const feedItems = await db
    .collection("api/v1/rss")
    .where("feed", "==", feed)
    .orderBy("timestamp", "desc")
    .limit(1)
    .get();
  if (feedItems.size === 1) return feedItems.docs[0].data() as RssDocument;
  throw new Error(`Unable to find an RSS feed for "${feed}"`);
}

/**
 * Wrapper function to get document data from an event.
 * @param event Firebase event
 * @returns {T | null}
 */
export function getDataFromEvent<T>(
  event: FirestoreEvent<QueryDocumentSnapshot | undefined>,
) {
  return event.data ? (event.data.data() as T) : null;
}
