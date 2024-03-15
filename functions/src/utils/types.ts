import { Timestamp } from "firebase-admin/firestore";

export interface PodcastEpisode {
  feed: string;
  title: string;
  description: string;
  publishDate: Timestamp;
  imageLink: string;
  metadata: {
    season: number;
    episode: number;
    transcriptUrl?: string;
    type?: "full" | "trailer" | "bonus";
    explicit: boolean;
  };
  fileData: {
    url: string;
    size: number;
    duration: number;
  };
}

export interface PodcastChannel {
  title: string;
  description: string;
  feedUrl: string;
  image: string;
  contact: {
    site: string;
    author: string;
    owner: string;
    email: string;
  };
  metadata: {
    type: "serial";
    locked: "yes" | "no";
    complete: "yes" | "no";
    categories: Array<{ category: string; subCategory?: string }>;
    language: "en-us";
    explicit: boolean;
  };
}

export interface RssDocument {
  feed: string;
  rss: string;
  timestamp: Timestamp;
}
