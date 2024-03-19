interface ImportMetaEnv {
  readonly PUBLIC_FIREBASE_API_KEY: string;
  readonly PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  readonly PUBLIC_FIREBASE_PROJECT_ID: string;
  readonly PUBLIC_FIREBASE_STORAGE_BUCKET: string;
  readonly PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly PUBLIC_FIREBASE_APP_ID: string;
  readonly PUBLIC_EMULATORS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type EpisodeType = "full" | "trailer" | "bonus";

interface EpisodeMetadata {
  season: number;
  episode: number;
  transcriptUrl?: string;
  type?: EpisodeType;
  explicit: boolean;
}

interface EpisodeFileData {
  url: string;
  size: number;
  duration: number;
}

interface PodcastEpisode {
  feed: string;
  title: string;
  description: string;
  publishDate: Date;
  imageLink: string;
  metadata: EpisodeMetadata;
  fileData: EpisodeFileData;
}

interface PodcastContact {
  site: string;
  author: string;
  owner: string;
  email: string;
}

type PodcastType = "serial";
type YesNo = "yes" | "no";
interface PodcastCategory {
  category: string;
  subCategory?: string;
}
type PodcastLanguage = "en-us";

interface PodcastMetadata {
  type: PodcastType;
  locked: YesNo;
  complete: YesNo;
  categories: PodcastCategory[];
  language: PodcastLanguage;
  explicit: boolean;
}

interface PodcastChannel {
  title: string;
  description: string;
  feedUrl: string;
  image: string;
  contact: PodcastContact;
  metadata: PodcastMetadata;
}

type SubmitCallback = Exclude<
  JSX.IntrinsicElements["form"]["onSubmit"],
  undefined
>;
