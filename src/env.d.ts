interface ImportMetaEnv {
  readonly FIREBASE_API_KEY: string;
  readonly FIREBASE_AUTH_DOMAIN: string;
  readonly FIREBASE_PROJECT_ID: string;
  readonly FIREBASE_STORAGE_BUCKET: string;
  readonly FIREBASE_MESSAGING_SENDER_ID: string;
  readonly FIREBASE_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface PodcastEpisode {
  feed: string;
  title: string;
  description: string;
  publishDate: Date;
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

interface PodcastChannel {
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
